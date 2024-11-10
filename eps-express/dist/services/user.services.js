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
exports.UserService = void 0;
const typeorm_config_1 = require("../configs/typeorm.config");
const user_entity_1 = require("../entities/user.entity");
const department_service_1 = require("./department.service");
const error_types_1 = require("../types/error.types");
const meta_type_1 = require("../types/meta.type");
const logger_1 = require("../utils/logger");
class UserService {
    constructor() {
        this.userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
        this.departmentService = new department_service_1.DepartmentService();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!data.deptCode) {
                throw new error_types_1.AppError("Department code is required", 400);
            }
            yield this.departmentService.findByCode(data.deptCode);
            const existingUser = yield this.userRepository.findOne({
                where: [{ userId: data.userId }, { email: data.email }],
            });
            if (existingUser) {
                throw new error_types_1.AppError("User with this userId or email already exists", 409);
            }
            const user = this.userRepository.create(Object.assign(Object.assign({}, data), { authLevel: data.authLevel || meta_type_1.UserType.USER, isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true }));
            return yield this.userRepository.save(user);
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            if (data.authLevel && user.authLevel === meta_type_1.UserType.ADMIN) {
                throw new error_types_1.AppError("Cannot modify ADMIN user auth level", 403);
            }
            if (data.deptCode) {
                yield this.departmentService.findByCode(data.deptCode);
            }
            if (data.email && data.email !== user.email) {
                const existingUser = yield this.userRepository.findOne({
                    where: { email: data.email },
                });
                if (existingUser) {
                    throw new error_types_1.AppError("Email already in use", 409);
                }
            }
            Object.assign(user, data);
            return yield this.userRepository.save(user);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                relations: ["department"],
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { userId },
                relations: ["department"],
            });
            if (!user) {
                throw new error_types_1.AppError("User not found", 404);
            }
            return user;
        });
    }
    findByDepartment(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                where: { deptCode },
                relations: ["department"],
            });
        });
    }
    deactivateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            user.isActive = false;
            return yield this.userRepository.save(user);
        });
    }
    activateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            user.isActive = true;
            return yield this.userRepository.save(user);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: { email },
                relations: ["department"],
            });
        });
    }
    findActiveUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                where: { isActive: true },
                relations: ["department"],
            });
        });
    }
    findByAuthLevel(authLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                where: { authLevel },
            });
        });
    }
    isAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            return user.authLevel === meta_type_1.UserType.ADMIN;
        });
    }
    isManager(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            return user.authLevel === meta_type_1.UserType.MANAGER;
        });
    }
    changeUserDepartment(userId, newDeptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            yield this.departmentService.findByCode(newDeptCode);
            user.deptCode = newDeptCode;
            return yield this.userRepository.save(user);
        });
    }
    changeUserAuthLevel(userId, newAuthLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByUserId(userId);
            if (user.authLevel === meta_type_1.UserType.ADMIN && newAuthLevel !== meta_type_1.UserType.ADMIN) {
                throw new error_types_1.AppError("Cannot demote ADMIN user", 403);
            }
            logger_1.logger.info(`Changing user ${userId} auth level from ${user.authLevel} to ${newAuthLevel}`);
            user.authLevel = newAuthLevel;
            return yield this.userRepository.save(user);
        });
    }
    getDepartmentUserStats(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find({
                where: { deptCode },
            });
            return users.reduce((acc, user) => {
                acc[user.authLevel] = (acc[user.authLevel] || 0) + 1;
                return acc;
            }, {});
        });
    }
    findAllAdminUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                where: [{ authLevel: meta_type_1.UserType.ADMIN }, { authLevel: meta_type_1.UserType.MANAGER }],
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.services.js.map