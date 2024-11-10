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
exports.PointBalance = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const meta_type_1 = require("../types/meta.type");
let PointBalance = class PointBalance extends base_entity_1.BaseEntity {
};
exports.PointBalance = PointBalance;
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: false,
        comment: "사용자 ID",
    }),
    __metadata("design:type", String)
], PointBalance.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: meta_type_1.PointType,
        nullable: false,
        comment: "포인트 구분",
    }),
    __metadata("design:type", String)
], PointBalance.prototype, "pointType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "integer",
        default: 0,
        comment: "현재 포인트 잔액",
    }),
    __metadata("design:type", Number)
], PointBalance.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "timestamp",
        nullable: false,
        comment: "마지막 업데이트 일시",
    }),
    __metadata("design:type", Date)
], PointBalance.prototype, "lastUpdatedAt", void 0);
exports.PointBalance = PointBalance = __decorate([
    (0, typeorm_1.Entity)("EPSP001M01"),
    (0, typeorm_1.Index)(["userId", "pointType"], { unique: true })
], PointBalance);
//# sourceMappingURL=point-balance.entity.js.map