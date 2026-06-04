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
exports.InteractiveController = void 0;
const common_1 = require("@nestjs/common");
const user_products_service_1 = require("./user-products.service");
const interactive_service_1 = require("./interactive.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let InteractiveController = class InteractiveController {
    interactiveService;
    userProductsService;
    constructor(interactiveService, userProductsService) {
        this.interactiveService = interactiveService;
        this.userProductsService = userProductsService;
    }
    async getStoreProducts(req) {
        return this.interactiveService.getStoreProducts(req.user.userId);
    }
    async getMyProducts(req) {
        return this.userProductsService.findAll(req.user.userId);
    }
    async deploy(req, data) {
        return this.userProductsService.deploy(req.user.userId, data);
    }
    async updateMapping(req, id, mappings) {
        return this.userProductsService.updateMapping(req.user.userId, id, mappings);
    }
    async remove(req, id) {
        return this.userProductsService.remove(req.user.userId, id);
    }
    async registerSession(req, body) {
        return this.interactiveService.registerSession(req.user.userId, body.orderId, body.username);
    }
};
exports.InteractiveController = InteractiveController;
__decorate([
    (0, common_1.Get)('store-products'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "getStoreProducts", null);
__decorate([
    (0, common_1.Get)('my-products'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "getMyProducts", null);
__decorate([
    (0, common_1.Post)('deploy'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "deploy", null);
__decorate([
    (0, common_1.Patch)('my-products/:id/map'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('mappings')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "updateMapping", null);
__decorate([
    (0, common_1.Delete)('my-products/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('register-session'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InteractiveController.prototype, "registerSession", null);
exports.InteractiveController = InteractiveController = __decorate([
    (0, common_1.Controller)('interactive'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [interactive_service_1.InteractiveService,
        user_products_service_1.UserProductsService])
], InteractiveController);
//# sourceMappingURL=interactive.controller.js.map