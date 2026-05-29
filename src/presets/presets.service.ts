import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RuleEvent, RuleAction, UserRole, Role } from '@prisma/client';

@Injectable()
export class PresetsService {
  private readonly logger = new Logger(PresetsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, role: UserRole) {
    const isAdmin = role === UserRole.ADMIN;
    
    return this.prisma.presets.findMany({
      where: isAdmin ? {} : {
        OR: [
          { isDefault: true },
          { user_presets: { some: { userId } } },
          { createdById: userId },
        ],
      },
      include: { 
        rules: true,
        user_presets: {
          where: { userId },
        },
      },
    });
  }

  async findMyPresets(userId: string) {
    return this.prisma.user_presets.findMany({
      where: { userId },
      include: {
        preset: {
          include: { rules: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async adopt(userId: string, presetId: string) {
    const preset = await this.prisma.presets.findUnique({
      where: { id: presetId },
    });

    if (!preset) throw new NotFoundException('Preset not found');
    if (!preset.isDefault) throw new ForbiddenException('Only default presets can be adopted');

    return this.prisma.user_presets.upsert({
      where: {
        userId_presetId: { userId, presetId },
      },
      update: {},
      create: {
        userId,
        presetId,
      },
    });
  }

  async fork(userId: string, presetId: string) {
    const sourcePreset = await this.prisma.presets.findUnique({
      where: { id: presetId },
      include: { rules: true },
    });

    if (!sourcePreset) throw new NotFoundException('Preset not found');

    // Create a new preset owned by the user
    const newPreset = await this.prisma.presets.create({
      data: {
        name: `${sourcePreset.name} (Fork)`,
        description: sourcePreset.description,
        gameId: sourcePreset.gameId,
        createdById: userId,
        isDefault: false,
        rules: {
          create: sourcePreset.rules.map(rule => ({
            event: rule.event,
            condition: rule.condition || {},
            action: rule.action,
            key: rule.key,
            sound: rule.sound,
            volume: rule.volume,
            duration: rule.duration,
          })),
        },
      },
    });

    // Create a UserPreset record for this new preset
    await this.prisma.user_presets.create({
      data: {
        userId,
        presetId: newPreset.id,
        sourcePresetId: sourcePreset.id,
        isActive: true, // Default new forks to active
      },
    });

    // Set other presets to inactive if this one is now active
    await this.prisma.user_presets.updateMany({
      where: {
        userId,
        presetId: { not: newPreset.id },
      },
      data: { isActive: false },
    });

    return newPreset;
  }

  async activate(userId: string, userPresetId: string) {
    const userPreset = await this.prisma.user_presets.findFirst({
      where: { id: userPresetId, userId },
    });

    if (!userPreset) throw new NotFoundException('UserPreset not found');

    // 1. Deactivate all
    await this.prisma.user_presets.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // 2. Activate specific
    return this.prisma.user_presets.update({
      where: { id: userPresetId },
      data: { isActive: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.presets.findUnique({
      where: { id },
      include: { rules: true },
    });
  }

  async create(userId: string, data: any) {
    const { rules, ...presetData } = data;
    
    // Check if user is admin to allow setting isDefault
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === Role.admin;

    const sanitizedRules = (rules || []).map(rule => ({
      event: rule.event as RuleEvent,
      condition: rule.condition, 
      action: rule.action as RuleAction,
      key: rule.key,
      sound: rule.sound,
      volume: rule.volume ? parseFloat(rule.volume) : 1.0,
      duration: rule.duration,
    }));

    const newPreset = await this.prisma.presets.create({
      data: {
        ...presetData,
        createdById: userId,
        isDefault: isAdmin ? (presetData.isDefault ?? false) : false,
        rules: {
          create: sanitizedRules,
        },
      },
      include: { rules: true },
    });

    // Create UserPreset and activate it
    await this.prisma.user_presets.create({
      data: {
        userId,
        presetId: newPreset.id,
        isActive: true,
      },
    });

    // Deactivate others
    await this.prisma.user_presets.updateMany({
      where: {
        userId,
        presetId: { not: newPreset.id },
      },
      data: { isActive: false },
    });

    return newPreset;
  }

  async update(id: string, data: any, user: any) {
    const { rules, ...presetData } = data;

    // 1. Fetch current preset to check ownership
    const currentPreset = await this.prisma.presets.findUnique({
      where: { id },
    });

    if (!currentPreset) throw new NotFoundException('Preset not found');

    // 2. Permission Check: Only Admin or Owner can update
    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = currentPreset.createdById === user.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You do not have permission to modify this preset');
    }

    // 3. Protection: Regular users cannot modify default presets
    if (!isAdmin && currentPreset.isDefault) {
      throw new ForbiddenException('Default presets are read-only. Please duplicate it to your account first.');
    }

    this.logger.log(`Updating preset ${id} by user ${user.userId}. Rules count: ${rules?.length || 0}`);
    
    try {
      if (rules) {
        const sanitizedRules = rules.map(rule => ({
          event: rule.event as RuleEvent,
          condition: rule.condition || {},
          action: rule.action as RuleAction,
          key: rule.key || '',
          sound: rule.sound || '',
          volume: rule.volume !== undefined ? parseFloat(rule.volume) : 1.0,
          duration: rule.duration || '0.1s',
        }));

        this.logger.log(`Deleting old rules for preset ${id}...`);
        await this.prisma.app_rules.deleteMany({ where: { presetId: id } });
        
        this.logger.log(`Inserting ${sanitizedRules.length} new rules...`);
        const result = await this.prisma.presets.update({
          where: { id },
          data: {
            ...presetData,
            rules: {
              create: sanitizedRules,
            },
          },
          include: { rules: true },
        });
        this.logger.log(`Preset ${id} updated successfully with new rules.`);
        return result;
      }

      const result = await this.prisma.presets.update({
        where: { id },
        data: presetData,
        include: { rules: true },
      });
      this.logger.log(`Preset ${id} updated successfully (no rules change).`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update preset ${id}: ${error}`, error);
      throw error;
    }
  }

  async remove(id: string, user: any) {
    const currentPreset = await this.prisma.presets.findUnique({
      where: { id },
    });

    if (!currentPreset) throw new NotFoundException('Preset not found');

    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = currentPreset.createdById === user.userId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('You do not have permission to delete this preset');
    }

    if (!isAdmin && currentPreset.isDefault) {
      throw new ForbiddenException('Default presets cannot be deleted');
    }

    return this.prisma.presets.delete({
      where: { id },
    });
  }
}
