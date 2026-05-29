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
var InteractiveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractiveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InteractiveService = InteractiveService_1 = class InteractiveService {
    prisma;
    logger = new common_1.Logger(InteractiveService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStoreProducts(userId) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Error fetching products from DB: ${error.message}`);
            }
            else {
                this.logger.error(`Error fetching products from DB: ${String(error)}`);
            }
            throw error;
        }
    }
};
exports.InteractiveService = InteractiveService;
exports.InteractiveService = InteractiveService = InteractiveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InteractiveService);
//# sourceMappingURL=interactive.service.js.map