import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        hwid: true,
        lastSeen: true,
        isOnlineDesktop: true,
        nativeExpiry: true,
        role: true,
        nativeStatus: true,
        created_at: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: any) {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async resetHwid(id: string) {
    return this.prisma.users.update({
      where: { id },
      data: { hwid: null },
    });
  }

  async remove(id: string) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
