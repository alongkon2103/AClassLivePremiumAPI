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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    prisma;
    verificationCache = new Map();
    constructor(configService, prisma) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'default-secret',
            passReqToCallback: true,
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(req, payload) {
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const internalKey = this.configService.get('INTERNAL_API_KEY');
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const cached = this.verificationCache.get(token);
        if (cached && cached.expiry > Date.now()) {
            return cached.result;
        }
        try {
            console.log(`[JwtStrategy] Verifying token via Store: ${token.substring(0, 15)}...`);
            const storeUrl = this.configService.get('STORE_URL') || 'http://localhost:3000';
            const response = await axios_1.default.post(`${storeUrl}/api/verify-token`, { token }, {
                headers: { 'x-internal-key': internalKey },
                timeout: 10000
            });
            if (response.data.valid) {
                const decoded = response.data.payload;
                const user = await this.prisma.users.findUnique({
                    where: { id: decoded.sub || decoded.userId },
                    select: { nativeStatus: true }
                });
                if (user?.nativeStatus === 'KICKED') {
                    console.warn(`[JwtStrategy] User ${decoded.sub} rejected: KICKED`);
                    throw new common_1.UnauthorizedException('คุณถูกเตะออกจากระบบ');
                }
                const result = {
                    userId: decoded.sub || decoded.userId,
                    orderId: decoded.orderId,
                    username: decoded.username || decoded.tiktokUsername,
                    role: decoded.role
                };
                this.verificationCache.set(token, {
                    result,
                    expiry: Date.now() + 60000
                });
                return result;
            }
            else {
                console.warn(`[JwtStrategy] Store rejected token: ${response.data.error || 'Unknown reason'}`);
            }
        }
        catch (error) {
            const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
            console.error(`[JwtStrategy] Verification via Store failed: ${errorMsg}`);
            throw new common_1.UnauthorizedException('Token verification failed');
        }
        throw new common_1.UnauthorizedException('Token verification failed');
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map