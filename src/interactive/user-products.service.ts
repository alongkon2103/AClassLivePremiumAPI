import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const productId: string | undefined = data?.productId;
    const slug: string | undefined = data?.slug;
    if (!productId && !slug) {
      throw new BadRequestException('Either productId or slug is required');
    }

    const product = await this.prisma.products.findUnique({
      where: productId ? { id: productId } : { slug: slug! },
      include: { product_functions: true },
    });

    if (!product) throw new NotFoundException('Product not found in store');

    const order = await this.prisma.orders.findFirst({
      where: { user_id: userId, product_id: product.id, status: 'paid' }
    });

    if (!order) throw new NotFoundException('You must purchase this product first');

    // Reset to official defaults: wipe all existing user mappings for this order,
    // then re-create one row per function that has a default gift.
    await this.prisma.$transaction([
      this.prisma.user_function_gifts.deleteMany({
        where: { user_id: userId, order_id: order.id },
      }),
      this.prisma.user_function_gifts.createMany({
        data: product.product_functions
          .filter(fn => fn.default_gift_id != null)
          .map(fn => ({
            user_id: userId,
            order_id: order.id,
            function_id: fn.id,
            gift_id: fn.default_gift_id!,
            trigger_threshold: fn.default_trigger_threshold,
            is_enabled: true,
          })),
      }),
    ]);

    return order;
  }

  async updateMapping(userId: string, orderId: string, mappings: any[]) {
    const order = await this.prisma.orders.findFirst({
      where: { id: orderId, user_id: userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    // Multi-row mode: the client sends the full desired set of (function, gift) pairs.
    // Duplicates of the same function_id are allowed (one function → many gifts), and
    // the same gift_id can appear under multiple functions. The DB unique key
    // (user_id, order_id, function_id, gift_id) prevents exact-duplicate rows.
    const rows = (mappings || [])
      .filter(m => m && m.functionId && m.giftId != null)
      .map(m => ({
        user_id: userId,
        order_id: orderId,
        function_id: m.functionId as string,
        gift_id: Number(m.giftId),
        trigger_threshold: m.triggerThreshold ?? null,
        is_enabled: m.isEnabled !== undefined ? Boolean(m.isEnabled) : true,
      }));

    await this.prisma.$transaction([
      this.prisma.user_function_gifts.deleteMany({
        where: { user_id: userId, order_id: orderId },
      }),
      this.prisma.user_function_gifts.createMany({
        data: rows,
      }),
    ]);

    return { success: true, count: rows.length };
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
