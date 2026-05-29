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
exports.StatusCleanupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StatusCleanupService = class StatusCleanupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        setInterval(() => this.cleanupOfflineUsers(), 120000);
    }
    async cleanupOfflineUsers() {
        try {
            const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
            await this.prisma.users.updateMany({
                where: {
                    isOnlineDesktop: true,
                    lastSeen: {
                        lt: threeMinutesAgo,
                    },
                },
                data: {
                    isOnlineDesktop: false,
                },
            });
        }
        catch (error) {
            console.error('[StatusCleanup] Error cleaning up offline users:', error);
        }
    }
};
exports.StatusCleanupService = StatusCleanupService;
exports.StatusCleanupService = StatusCleanupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatusCleanupService);
//# sourceMappingURL=status-cleanup.service.js.map