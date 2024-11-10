"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentService = void 0;
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../configs/typeorm.config");
const department_entity_1 = require("../entities/department.entity");
const error_types_1 = require("../types/error.types");
class DepartmentService {
    constructor() {
        this.departmentRepository = typeorm_config_1.AppDataSource.getRepository(department_entity_1.Department);
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.parentDeptCode) {
                const parentDept = yield this.departmentRepository.findOne({
                    where: { deptCode: data.parentDeptCode },
                });
                if (!parentDept) {
                    throw new error_types_1.AppError("Parent department not found", 404);
                }
            }
            const department = this.departmentRepository.create(data);
            return yield this.departmentRepository.save(department);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.departmentRepository.find({
                relations: ["parent", "children"],
            });
        });
    }
    getHierarchy() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.departmentRepository.find({
                where: {
                    parentDeptCode: (0, typeorm_1.IsNull)(),
                },
                relations: ["children"],
                order: { deptCode: "ASC" },
            });
        });
    }
    getFullHierarchy() {
        return __awaiter(this, void 0, void 0, function* () {
            const roots = yield this.departmentRepository
                .createQueryBuilder("dept")
                .leftJoinAndSelect("dept.children", "children")
                .leftJoinAndSelect("children.children", "grandchildren")
                .where("dept.parentDeptCode IS NULL")
                .orderBy("dept.deptCode", "ASC")
                .addOrderBy("children.deptCode", "ASC")
                .addOrderBy("grandchildren.deptCode", "ASC")
                .getMany();
            return roots;
        });
    }
    getDepartmentTree(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.departmentRepository
                .createQueryBuilder("dept")
                .leftJoinAndSelect("dept.children", "children")
                .leftJoinAndSelect("children.children", "grandchildren")
                .where("dept.deptCode = :deptCode", { deptCode })
                .orderBy("children.deptCode", "ASC")
                .addOrderBy("grandchildren.deptCode", "ASC")
                .getOne();
        });
    }
    getDepartmentPath(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = [];
            let currentDept = yield this.findByCode(deptCode);
            while (currentDept) {
                path.unshift(currentDept);
                if (!currentDept.parentDeptCode)
                    break;
                currentDept = yield this.findByCode(currentDept.parentDeptCode);
            }
            return path;
        });
    }
    getChildDeptCodes(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.departmentRepository.find({
                where: { parentDeptCode: deptCode },
            });
            let childCodes = children.map((child) => child.deptCode);
            for (const child of children) {
                const grandChildCodes = yield this.getChildDeptCodes(child.deptCode);
                childCodes = [...childCodes, ...grandChildCodes];
            }
            return childCodes;
        });
    }
    moveDepartment(deptCode, newParentDeptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.findByCode(deptCode);
            if (deptCode === newParentDeptCode) {
                throw new error_types_1.AppError("Department cannot be its own parent", 400);
            }
            if (newParentDeptCode) {
                const childCodes = yield this.getChildDeptCodes(deptCode);
                if (childCodes.includes(newParentDeptCode)) {
                    throw new error_types_1.AppError("Cannot set child department as parent", 400);
                }
                yield this.findByCode(newParentDeptCode);
            }
            department.parentDeptCode = newParentDeptCode;
            return yield this.departmentRepository.save(department);
        });
    }
    getDepartmentStats(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.findByCode(deptCode);
            const childCodes = yield this.getChildDeptCodes(deptCode);
            const path = yield this.getDepartmentPath(deptCode);
            const [totalUsers, activeUsers] = yield Promise.all([
                this.departmentRepository
                    .createQueryBuilder("dept")
                    .leftJoin("dept.users", "user")
                    .where("dept.deptCode IN (:...deptCodes)", {
                    deptCodes: [deptCode, ...childCodes],
                })
                    .getCount(),
                this.departmentRepository
                    .createQueryBuilder("dept")
                    .leftJoin("dept.users", "user")
                    .where("dept.deptCode IN (:...deptCodes)", {
                    deptCodes: [deptCode, ...childCodes],
                })
                    .andWhere("user.isActive = :isActive", { isActive: true })
                    .getCount(),
            ]);
            return {
                totalUsers,
                activeUsers,
                childDepartments: childCodes.length,
                depth: path.length,
            };
        });
    }
    findByCode(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.departmentRepository.findOne({
                where: { deptCode },
                relations: ["parent", "children", "users"],
            });
            if (!department) {
                throw new error_types_1.AppError("Department not found", 404);
            }
            return department;
        });
    }
    update(deptCode, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.findByCode(deptCode);
            if (data.parentDeptCode &&
                data.parentDeptCode !== department.parentDeptCode) {
                if (data.parentDeptCode === deptCode) {
                    throw new error_types_1.AppError("Department cannot be its own parent", 400);
                }
                const parentDept = yield this.findByCode(data.parentDeptCode);
                const childDepts = yield this.getAllChildDepartments(deptCode);
                if (childDepts.some((child) => child.deptCode === data.parentDeptCode)) {
                    throw new error_types_1.AppError("Cannot set child department as parent", 400);
                }
            }
            Object.assign(department, data);
            return yield this.departmentRepository.save(department);
        });
    }
    getAllChildDepartments(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.departmentRepository.find({
                where: { parentDeptCode: deptCode },
            });
            const allChildren = [...children];
            for (const child of children) {
                const grandChildren = yield this.getAllChildDepartments(child.deptCode);
                allChildren.push(...grandChildren);
            }
            return allChildren;
        });
    }
}
exports.DepartmentService = DepartmentService;
//# sourceMappingURL=department.service.js.map