import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(all: boolean = false) {
    const where = all ? {} : { isActive: true };
    return this.prisma.announcements.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: any) {
    return this.prisma.announcements.create({ 
      data: {
        ...data,
        createdById: userId,
      } 
    });
  }

  async update(id: string, data: any) {
    return this.prisma.announcements.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.announcements.delete({
      where: { id },
    });
  }
}
