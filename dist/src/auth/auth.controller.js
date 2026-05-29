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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const config_1 = require("@nestjs/config");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async googleAuth(req) { }
    async googleAuthRedirect(req, res) {
        const webUrl = this.configService.get('WEB_URL') || 'http://localhost:5173';
        try {
            const user = await this.authService.validateOAuthUser(req.user);
            const result = await this.authService.login(user);
            const token = result.access_token;
            const userData = encodeURIComponent(JSON.stringify(result.user));
            return res.redirect(`${webUrl}/login?token=${token}&user=${userData}`);
        }
        catch (error) {
            const message = encodeURIComponent(error.message || 'Authentication failed');
            return res.redirect(`${webUrl}/login?error=${message}`);
        }
    }
    async discordAuth(req) { }
    async discordAuthRedirect(req, res) {
        const webUrl = this.configService.get('WEB_URL') || 'http://localhost:5173';
        try {
            const user = await this.authService.validateOAuthUser(req.user);
            const result = await this.authService.login(user);
            const token = result.access_token;
            const userData = encodeURIComponent(JSON.stringify(result.user));
            return res.redirect(`${webUrl}/login?token=${token}&user=${userData}`);
        }
        catch (error) {
            const message = encodeURIComponent(error.message || 'Authentication failed');
            return res.redirect(`${webUrl}/login?error=${message}`);
        }
    }
    async verifyHwid(req, hwid) {
        return this.authService.verifyHwid(req.user.userId, hwid);
    }
    async heartbeat(req, status) {
        return this.authService.updateLastSeen(req.user.userId, status);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('discord'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('discord')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "discordAuth", null);
__decorate([
    (0, common_1.Get)('discord/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('discord')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "discordAuthRedirect", null);
__decorate([
    (0, common_1.Post)('verify-hwid'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('hwid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyHwid", null);
__decorate([
    (0, common_1.Post)('heartbeat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "heartbeat", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map