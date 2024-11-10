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
exports.PointTransaction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const meta_type_1 = require("../types/meta.type");
let PointTransaction = class PointTransaction extends base_entity_1.BaseEntity {
};
exports.PointTransaction = PointTransaction;
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: false,
        comment: "보낸 사용자 ID",
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PointTransaction.prototype, "senderUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 50,
        nullable: false,
        comment: "받은 사용자 ID",
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], PointTransaction.prototype, "receiverUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "date",
        nullable: false,
        comment: "포인트 부여 일자",
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", Date)
], PointTransaction.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: meta_type_1.PointReasonCode,
        nullable: false,
        comment: "사유 구분 코드",
    }),
    __metadata("design:type", String)
], PointTransaction.prototype, "reasonCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 500,
        nullable: true,
        comment: "사유 내용",
    }),
    __metadata("design:type", String)
], PointTransaction.prototype, "reasonDetail", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "integer",
        nullable: false,
        comment: "포인트",
    }),
    __metadata("design:type", Number)
], PointTransaction.prototype, "points", void 0);
exports.PointTransaction = PointTransaction = __decorate([
    (0, typeorm_1.Entity)("EPSP001L01")
], PointTransaction);
//# sourceMappingURL=point-transaction.entity.js.map