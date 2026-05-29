import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProductsService {
  constructor(private prisma: PrismaService) { }

  async findAll(userId: string) {
    return this.prisma.orders.findMany({
      where: {
        user_id: userId,
        status: 'paid'
      },
      include: {
        products: {
          include: {
            product_images: true, // <-- เพิ่มตรงนี้

            product_functions: {
              include: {
                default_gift: true
              },
              orderBy: {
                sort_order: 'asc'
              }
            }
          }
        },

        user_function_gifts: {
          include: {
            gifts: true
          }
        }
      },

      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async deploy(userId: string, data: any) {
    const { slug } = data;

    // 1. Find the product by slug with its functions
    const product = await this.prisma.products.findUnique({
      where: { slug },
      include: { product_functions: true }
    });

    if (!product) throw new NotFoundException('Product not found in store');

    // 2. Ensure order exists and is paid
    let order = await this.prisma.orders.findFirst({
      where: { user_id: userId, product_id: product.id, status: 'paid' }
    });

    if (!order) {
      throw new NotFoundException('You must purchase this product first');
    }

    // 3. Reset/Initialize all mappings to the official defaults
    for (const fn of product.product_functions) {
      if (fn.default_gift_id) {
        await this.prisma.user_function_gifts.upsert({
          where: {
            user_id_order_id_function_id: {
              user_id: userId,
              order_id: order.id,
              function_id: fn.id,
            },
          },
          update: {
            gift_id: fn.default_gift_id,
            trigger_threshold: fn.default_trigger_threshold
          },
          create: {
            user_id: userId,
            order_id: order.id,
            function_id: fn.id,
            gift_id: fn.default_gift_id,
            trigger_threshold: fn.default_trigger_threshold
          },
        });
      }
    }

    return order;
  }

  async updateMapping(userId: string, orderId: string, mappings: any[]) {
    const order = await this.prisma.orders.findFirst({
      where: { id: orderId, user_id: userId },
    });

    if (!order) throw new NotFoundException('Order not found');

    for (const m of mappings) {
      // Find the gift in our unified table by giftId (the TikTok integer ID)
      // Note: in store schema 'gifts' table ID is the integer ID

      await this.prisma.user_function_gifts.upsert({
        where: {
          user_id_order_id_function_id: {
            user_id: userId,
            order_id: orderId,
            function_id: m.functionId,
          },
        },
        update: {
          gift_id: m.giftId,
          trigger_threshold: m.triggerThreshold,
          is_enabled: m.isEnabled !== undefined ? m.isEnabled : true
        },
        create: {
          user_id: userId,
          order_id: orderId,
          function_id: m.functionId,
          gift_id: m.giftId,
          trigger_threshold: m.triggerThreshold,
          is_enabled: m.isEnabled !== undefined ? m.isEnabled : true
        },
      });
    }

    return { success: true };
  }

  async remove(userId: string, orderId: string) {
    // We "undeploy" by setting order status to something else or deleting it
    // For safety, let's just mark it as 'cancelled' so it disappears from the list
    return this.prisma.orders.updateMany({
      where: { id: orderId, user_id: userId },
      data: { status: 'cancelled' }
    });
  }
}
