import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.gifts.findMany({
      where: { is_active: true },
      orderBy: { sort_order: 'asc' },
    });
  }

  async findOneByGiftId(giftId: number) {
    return this.prisma.gifts.findUnique({
      where: { id: giftId },
    });
  }
}
