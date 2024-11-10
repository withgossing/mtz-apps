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
exports.Department = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
let Department = class Department extends base_entity_1.BaseEntity {
};
exports.Department = Department;
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        nullable: false,
        comment: "부서코드",
    }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], Department.prototype, "deptCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 100,
        nullable: false,
        comment: "부서명",
    }),
    __metadata("design:type", String)
], Department.prototype, "deptName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        length: 20,
        nullable: true,
        comment: "상위부서코드",
    }),
    __metadata("design:type", Object)
], Department.prototype, "parentDeptCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "boolean",
        default: true,
        comment: "활성화 여부",
    }),
    __metadata("design:type", Boolean)
], Department.prototype, "isActive", void 0);
exports.Department = Department = __decorate([
    (0, typeorm_1.Entity)("EPSD001M01")
], Department);
//# sourceMappingURL=department.entity.js.map