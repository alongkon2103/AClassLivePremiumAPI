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
exports.TiktokController = void 0;
const common_1 = require("@nestjs/common");
const tiktok_service_1 = require("./tiktok.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TiktokController = class TiktokController {
    tiktokService;
    constructor(tiktokService) {
        this.tiktokService = tiktokService;
    }
    async register(req, username, orderId) {
        return this.tiktokService.register(orderId || req.user.userId || req.user.orderId, username);
    }
    async pushEvent(req, type, data) {
        return this.tiktokService.pushEvent(req.user.userId || req.user.orderId, type, data);
    }
    async heartbeat(req) {
        return this.tiktokService.heartbeat(req.user.userId || req.user.orderId);
    }
};
exports.TiktokController = TiktokController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('username')),
    __param(2, (0, common_1.Body)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TiktokController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('push-event'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('type')),
    __param(2, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TiktokController.prototype, "pushEvent", null);
__decorate([
    (0, common_1.Post)('heartbeat'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TiktokController.prototype, "heartbeat", null);
exports.TiktokController = TiktokController = __decorate([
    (0, common_1.Controller)('tiktok'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tiktok_service_1.TiktokService])
], TiktokController);
//# sourceMappingURL=tiktok.controller.js.map