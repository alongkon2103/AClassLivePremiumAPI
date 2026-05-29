"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PresetsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PresetsService = PresetsService_1 = class PresetsService {
    prisma;
    logger = new common_1.Logger(PresetsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, role) {
        const isAdmin = role === client_1.UserRole.ADMIN;
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
    async findMyPresets(userId) {
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
    async adopt(userId, presetId) {
        const preset = await this.prisma.presets.findUnique({
            where: { id: presetId },
        });
        if (!preset)
            throw new common_1.NotFoundException('Preset not found');
        if (!preset.isDefault)
            throw new common_1.ForbiddenException('Only default presets can be adopted');
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
    async fork(userId, presetId) {
        const sourcePreset = await this.prisma.presets.findUnique({
            where: { id: presetId },
            include: { rules: true },
        });
        if (!sourcePreset)
            throw new common_1.NotFoundException('Preset not found');
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
        await this.prisma.user_presets.create({
            data: {
                userId,
                presetId: newPreset.id,
                sourcePresetId: sourcePreset.id,
                isActive: true,
            },
        });
        await this.prisma.user_presets.updateMany({
            where: {
                userId,
                presetId: { not: newPreset.id },
            },
            data: { isActive: false },
        });
        return newPreset;
    }
    async activate(userId, userPresetId) {
        const userPreset = await this.prisma.user_presets.findFirst({
            where: { id: userPresetId, userId },
        });
        if (!userPreset)
            throw new common_1.NotFoundException('UserPreset not found');
        await this.prisma.user_presets.updateMany({
            where: { userId },
            data: { isActive: false },
        });
        return this.prisma.user_presets.update({
            where: { id: userPresetId },
            data: { isActive: true },
        });
    }
    async findOne(id) {
        return this.prisma.presets.findUnique({
            where: { id },
            include: { rules: true },
        });
    }
    async create(userId, data) {
        const { rules, ...presetData } = data;
        const user = await this.prisma.users.findUnique({ where: { id: userId } });
        const isAdmin = user?.role === client_1.Role.admin;
        const sanitizedRules = (rules || []).map(rule => ({
            event: rule.event,
            condition: rule.condition,
            action: rule.action,
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
        await this.prisma.user_presets.create({
            data: {
                userId,
                presetId: newPreset.id,
                isActive: true,
            },
        });
        await this.prisma.user_presets.updateMany({
            where: {
                userId,
                presetId: { not: newPreset.id },
            },
            data: { isActive: false },
        });
        return newPreset;
    }
    async update(id, data, user) {
        const { rules, ...presetData } = data;
        const currentPreset = await this.prisma.presets.findUnique({
            where: { id },
        });
        if (!currentPreset)
            throw new common_1.NotFoundException('Preset not found');
        const isAdmin = user.role === client_1.UserRole.ADMIN;
        const isOwner = currentPreset.createdById === user.userId;
        if (!isAdmin && !isOwner) {
            throw new common_1.ForbiddenException('You do not have permission to modify this preset');
        }
        if (!isAdmin && currentPreset.isDefault) {
            throw new common_1.ForbiddenException('Default presets are read-only. Please duplicate it to your account first.');
        }
        this.logger.log(`Updating preset ${id} by user ${user.userId}. Rules count: ${rules?.length || 0}`);
        try {
            if (rules) {
                const sanitizedRules = rules.map(rule => ({
                    event: rule.event,
                    condition: rule.condition || {},
                    action: rule.action,
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
        }
        catch (error) {
            this.logger.error(`Failed to update preset ${id}: ${error}`, error);
            throw error;
        }
    }
    async remove(id, user) {
        const currentPreset = await this.prisma.presets.findUnique({
            where: { id },
        });
        if (!currentPreset)
            throw new common_1.NotFoundException('Preset not found');
        const isAdmin = user.role === client_1.UserRole.ADMIN;
        const isOwner = currentPreset.createdById === user.userId;
        if (!isAdmin && !isOwner) {
            throw new common_1.ForbiddenException('You do not have permission to delete this preset');
        }
        if (!isAdmin && currentPreset.isDefault) {
            throw new common_1.ForbiddenException('Default presets cannot be deleted');
        }
        return this.prisma.presets.delete({
            where: { id },
        });
    }
};
exports.PresetsService = PresetsService;
exports.PresetsService = PresetsService = PresetsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresetsService);
//# sourceMappingURL=presets.service.js.map