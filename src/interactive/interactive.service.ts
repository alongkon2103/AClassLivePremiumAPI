import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractiveService {
  private readonly logger = new Logger(InteractiveService.name);

  constructor(private prisma: PrismaService) { }

  async getStoreProducts(userId: string) {
    try {
      const products = await this.prisma.products.findMany({
        where: {
          is_active: true,
          orders: {
            some: {
              user_id: userId,
              status: 'paid',
            },
          },
        },
        include: {
          product_functions: {
            include: {
              default_gift: true,
            },
            orderBy: {
              sort_order: 'asc',
            },
          },
          product_images: {
            orderBy: {
              sort_order: 'asc',
            },
          },
        },
        orderBy: [
          {
            is_featured: 'desc',
          },
          {
            created_at: 'desc',
          },
        ],
      });

      return { success: true, data: products };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error fetching products from DB: ${error.message}`);
      } else {
        this.logger.error(`Error fetching products from DB: ${String(error)}`);
      }

      throw error;
    }
  }
}