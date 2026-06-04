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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserProductsService = class UserProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        return this.prisma.orders.findMany({
            where: {
                user_id: userId,
                status: 'paid'
            },
            include: {
                products: {
                    include: {
                        product_images: true,
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
    async deploy(userId, data) {
        const productId = data?.productId;
        const slug = data?.slug;
        if (!productId && !slug) {
            throw new common_1.BadRequestException('Either productId or slug is required');
        }
        const product = await this.prisma.products.findUnique({
            where: productId ? { id: productId } : { slug: slug },
            include: { product_functions: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found in store');
        const order = await this.prisma.orders.findFirst({
            where: { user_id: userId, product_id: product.id, status: 'paid' }
        });
        if (!order)
            throw new common_1.NotFoundException('You must purchase this product first');
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
                    gift_id: fn.default_gift_id,
                    trigger_threshold: fn.default_trigger_threshold,
                    is_enabled: true,
                })),
            }),
        ]);
        return order;
    }
    async updateMapping(userId, orderId, mappings) {
        const order = await this.prisma.orders.findFirst({
            where: { id: orderId, user_id: userId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const rows = (mappings || [])
            .filter(m => m && m.functionId && m.giftId != null)
            .map(m => ({
            user_id: userId,
            order_id: orderId,
            function_id: m.functionId,
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
    async remove(userId, orderId) {
        return this.prisma.orders.updateMany({
            where: { id: orderId, user_id: userId },
            data: { status: 'cancelled' }
        });
    }
};
exports.UserProductsService = UserProductsService;
exports.UserProductsService = UserProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserProductsService);
//# sourceMappingURL=user-products.service.js.map