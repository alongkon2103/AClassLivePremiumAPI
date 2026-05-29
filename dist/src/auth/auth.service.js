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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateOAuthUser(profile) {
        const { email, username, avatar, provider, providerId } = profile;
        if (!email) {
            throw new common_1.UnauthorizedException('Social account must have an email address.');
        }
        let account = await this.prisma.accounts.findUnique({
            where: {
                provider_provider_account_id: {
                    provider,
                    provider_account_id: providerId,
                },
            },
            include: { users: true },
        });
        if (account) {
            if (account.users.nativeStatus === 'BANNED' || account.users.nativeStatus === 'SUSPENDED') {
                throw new common_1.UnauthorizedException('Your account has been suspended.');
            }
            if (account.users.nativeStatus === 'KICKED') {
                await this.prisma.users.update({
                    where: { id: account.users.id },
                    data: { nativeStatus: 'ACTIVE' },
                });
            }
            if (account.users.avatar !== avatar || account.users.username !== username) {
                await this.prisma.users.update({
                    where: { id: account.users.id },
                    data: { avatar, username: username || account.users.username },
                });
            }
            return account.users;
        }
        let user = await this.prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            user = await this.prisma.users.create({
                data: {
                    email,
                    username: username || email.split('@')[0],
                    avatar,
                    role: 'user',
                    nativeStatus: 'ACTIVE',
                },
            });
        }
        else if (user.nativeStatus !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Your account has been suspended.');
        }
        await this.prisma.accounts.create({
            data: {
                user_id: user.id,
                provider,
                provider_account_id: providerId,
            },
        });
        return user;
    }
    async login(user, hwid) {
        if (user.role?.toLowerCase() === 'user') {
            const orderCount = await this.prisma.orders.count({
                where: {
                    user_id: user.id,
                    OR: [
                        { status: { in: ['paid', 'fulfilled', 'completed', 'active'] } },
                        { paid_at: { not: null } }
                    ]
                },
            });
            if (orderCount === 0) {
                throw new common_1.UnauthorizedException('เข้าถึงถูกปฏิเสธ: คุณต้องเคยซื้อสินค้าอย่างน้อย 1 รายการเพื่อใช้งานโปรแกรมนี้');
            }
        }
        await this.prisma.users.update({
            where: { id: user.id },
            data: {
                lastSeen: new Date(),
                isOnlineDesktop: true
            },
        });
        if (hwid && hwid !== 'browser-dev-id') {
            if (user.hwid && user.hwid !== hwid) {
                throw new common_1.UnauthorizedException('HWID mismatch. This account is bound to another device.');
            }
            if (!user.hwid) {
                const existingUserWithHwid = await this.prisma.users.findUnique({
                    where: { hwid },
                });
                if (existingUserWithHwid && existingUserWithHwid.id !== user.id) {
                    throw new common_1.UnauthorizedException('This device is already bound to another account.');
                }
                await this.prisma.users.update({
                    where: { id: user.id },
                    data: { hwid },
                });
            }
        }
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role,
            email: user.email
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                expiry: user.expiry,
            },
        };
    }
    async verifyHwid(userId, hwid) {
        if (!hwid || hwid === 'browser-dev-id') {
            return { success: true, message: 'Skipping HWID check for development' };
        }
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.role?.toLowerCase() === 'user') {
            const orderCount = await this.prisma.orders.count({
                where: {
                    user_id: user.id,
                    OR: [
                        { status: { in: ['paid', 'fulfilled', 'completed', 'active'] } },
                        { paid_at: { not: null } }
                    ]
                },
            });
            if (orderCount === 0) {
                throw new common_1.UnauthorizedException('เข้าถึงถูกปฏิเสธ: คุณต้องเคยซื้อสินค้าอย่างน้อย 1 รายการเพื่อใช้งานโปรแกรมนี้');
            }
        }
        if (user.hwid && user.hwid !== hwid) {
            throw new common_1.UnauthorizedException('This account is bound to another device. Please contact admin to reset.');
        }
        if (!user.hwid) {
            const existingUserWithHwid = await this.prisma.users.findUnique({
                where: { hwid },
            });
            if (existingUserWithHwid && existingUserWithHwid.id !== user.id) {
                throw new common_1.UnauthorizedException('This device is already bound to another account.');
            }
            await this.prisma.users.update({
                where: { id: user.id },
                data: { hwid, lastSeen: new Date() },
            });
            return { success: true, message: 'HWID verified and bound' };
        }
        return { success: true, message: 'HWID verified' };
    }
    async updateLastSeen(userId, status = 'online') {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            select: { nativeStatus: true }
        });
        if (user && user.nativeStatus === 'KICKED') {
            this.logger.warn(`User ${userId} heartbeat rejected: KICKED`);
            await this.prisma.users.update({
                where: { id: userId },
                data: { isOnlineDesktop: false }
            });
            return {
                success: false,
                action: 'forced_logout',
                message: 'คุณถูกเตะออกจากระบบโดยผู้ดูแลระบบ'
            };
        }
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                lastSeen: new Date(),
                isOnlineDesktop: status === 'online'
            },
        });
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map