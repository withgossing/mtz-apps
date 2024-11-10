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
exports.requireSelfOrAdmin = exports.requireDepartmentAccess = exports.requireAuth = exports.authMiddleware = void 0;
const user_context_1 = require("../utils/user-context");
const user_services_1 = require("../services/user.services");
const meta_type_1 = require("../types/meta.type");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.headers["user-id"] || "system";
        const userService = new user_services_1.UserService();
        if (userId !== "system") {
            try {
                const user = yield userService.findByUserId(userId);
                if (!user.isActive) {
                    throw new error_types_1.AppError("Inactive user", 403);
                }
                req.user = {
                    userId: user.userId,
                    authLevel: user.authLevel,
                    deptCode: user.deptCode,
                };
            }
            catch (error) {
                logger_1.logger.error(`Authentication failed for userId: ${userId}`);
                throw new error_types_1.AppError("Authentication failed", 401);
            }
        }
        yield user_context_1.UserContextService.getInstance().run(userId, () => __awaiter(void 0, void 0, void 0, function* () {
            next();
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.authMiddleware = authMiddleware;
const requireAuth = (requiredLevel) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                throw new error_types_1.AppError("Authentication required", 401);
            }
            const authLevelValues = {
                [meta_type_1.UserType.ADMIN]: 3,
                [meta_type_1.UserType.MANAGER]: 2,
                [meta_type_1.UserType.USER]: 1,
            };
            if (authLevelValues[req.user.authLevel] <
                authLevelValues[requiredLevel]) {
                logger_1.logger.warn(`Access denied for user ${req.user.userId} - Required level: ${requiredLevel}, Current level: ${req.user.authLevel}`);
                throw new error_types_1.AppError("Insufficient permissions", 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.requireAuth = requireAuth;
const requireDepartmentAccess = (allowSameDeptOnly = true) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                throw new error_types_1.AppError("Authentication required", 401);
            }
            const targetDeptCode = req.params.deptCode || req.body.deptCode;
            if (req.user.authLevel === meta_type_1.UserType.ADMIN) {
                return next();
            }
            if (allowSameDeptOnly && req.user.authLevel === meta_type_1.UserType.MANAGER) {
                if (req.user.deptCode !== targetDeptCode) {
                    logger_1.logger.warn(`Department access denied for user ${req.user.userId} to department ${targetDeptCode}`);
                    throw new error_types_1.AppError("Department access denied", 403);
                }
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.requireDepartmentAccess = requireDepartmentAccess;
const requireSelfOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new error_types_1.AppError("Authentication required", 401);
        }
        const targetUserId = req.params.userId || req.body.userId;
        if (req.user.authLevel === meta_type_1.UserType.ADMIN ||
            req.user.userId === targetUserId) {
            next();
        }
        else {
            logger_1.logger.warn(`Access denied for user ${req.user.userId} to target user ${targetUserId}`);
            throw new error_types_1.AppError("Access denied", 403);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.requireSelfOrAdmin = requireSelfOrAdmin;
//# sourceMappingURL=auth.middleware.js.map