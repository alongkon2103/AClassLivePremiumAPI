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
var TiktokService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TiktokService = TiktokService_1 = class TiktokService {
    prisma;
    logger = new common_1.Logger(TiktokService_1.name);
    activeOrderSessions = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async register(userIdOrOrderId, username) {
        let userId = userIdOrOrderId;
        let orderId = userIdOrOrderId;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userIdOrOrderId)) {
            const order = await this.prisma.orders.findUnique({
                where: { id: userIdOrOrderId },
                select: { user_id: true }
            });
            if (order) {
                userId = order.user_id;
                orderId = userIdOrOrderId;
            }
        }
        else if (userIdOrOrderId === 'simulator') {
            this.logger.log('Simulator registration');
            return { success: true, simulator: true };
        }
        this.logger.log(`Registering session for user ${userId} with order ${orderId} (@${username})`);
        console.log(`[SYSTEM] Registered: ${username} (order: ${orderId})`);
        this.activeOrderSessions.set(userId, orderId);
        try {
            await this.prisma.users.update({
                where: { id: userId },
                data: { isOnlineDesktop: true, lastSeen: new Date() },
            });
        }
        catch (e) {
            this.logger.warn(`Could not update user status: ${e.message}`);
        }
        return { success: true };
    }
    async pushEvent(userIdOrOrderId, type, data) {
        let userId = userIdOrOrderId;
        let orderId = userIdOrOrderId;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userIdOrOrderId)) {
            const order = await this.prisma.orders.findUnique({
                where: { id: userIdOrOrderId },
                select: { user_id: true }
            });
            if (order) {
                userId = order.user_id;
                orderId = userIdOrOrderId;
            }
        }
        else if (userIdOrOrderId === 'simulator') {
            return { success: true, pushed: true, simulator: true };
        }
        const activeOrder = this.activeOrderSessions.get(userId);
        if (activeOrder && activeOrder !== orderId) {
            this.logger.warn(`Rejected event from order ${orderId}: user ${userId} has ${activeOrder} active.`);
            return { success: false, error: 'Session mismatch: another game is active' };
        }
        this.logger.log(`Received TikTok event [${type}] from user ${userId} (Order: ${orderId})`);
        console.log(`[EVENT] ${type} from ${userId} (active order: ${activeOrder})`);
        try {
            await this.prisma.users.update({
                where: { id: userId },
                data: { lastSeen: new Date() },
            });
        }
        catch (e) { }
        return { success: true, pushed: true };
    }
    async heartbeat(userIdOrOrderId) {
        let userId = userIdOrOrderId;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userIdOrOrderId)) {
            const order = await this.prisma.orders.findUnique({
                where: { id: userIdOrOrderId },
                select: { user_id: true }
            });
            if (order) {
                userId = order.user_id;
            }
        }
        else if (userIdOrOrderId === 'simulator') {
            return { success: true };
        }
        try {
            await this.prisma.users.update({
                where: { id: userId },
                data: { isOnlineDesktop: true, lastSeen: new Date() },
            });
        }
        catch (e) { }
        return { success: true };
    }
};
exports.TiktokService = TiktokService;
exports.TiktokService = TiktokService = TiktokService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TiktokService);
//# sourceMappingURL=tiktok.service.js.map