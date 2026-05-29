import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.games.findMany({
      include: {
        presets: {
          where: { isDefault: true },
          include: { rules: true }
        }
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.games.findUnique({
      where: { id },
      include: {
        presets: {
          include: { rules: true }
        }
      }
    });
  }

  async create(data: any) {
    return this.prisma.games.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.games.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.games.delete({
      where: { id }
    });
  }
}
