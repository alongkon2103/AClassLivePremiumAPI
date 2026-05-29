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
exports.PresetsController = void 0;
const common_1 = require("@nestjs/common");
const presets_service_1 = require("./presets.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PresetsController = class PresetsController {
    presetsService;
    constructor(presetsService) {
        this.presetsService = presetsService;
    }
    findAll(req) {
        return this.presetsService.findAll(req.user.userId, req.user.role);
    }
    findMyPresets(req) {
        return this.presetsService.findMyPresets(req.user.userId);
    }
    findOne(id) {
        return this.presetsService.findOne(id);
    }
    create(req, data) {
        return this.presetsService.create(req.user.userId, data);
    }
    adopt(req, id) {
        return this.presetsService.adopt(req.user.userId, id);
    }
    fork(req, id) {
        return this.presetsService.fork(req.user.userId, id);
    }
    activate(req, userPresetId) {
        return this.presetsService.activate(req.user.userId, userPresetId);
    }
    update(req, id, data) {
        return this.presetsService.update(id, data, req.user);
    }
    remove(req, id) {
        return this.presetsService.remove(id, req.user);
    }
};
exports.PresetsController = PresetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "findMyPresets", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/adopt'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "adopt", null);
__decorate([
    (0, common_1.Post)(':id/fork'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "fork", null);
__decorate([
    (0, common_1.Patch)('my/:userPresetId/activate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userPresetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PresetsController.prototype, "remove", null);
exports.PresetsController = PresetsController = __decorate([
    (0, common_1.Controller)('presets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [presets_service_1.PresetsService])
], PresetsController);
//# sourceMappingURL=presets.controller.js.map