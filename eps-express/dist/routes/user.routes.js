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
exports.userRouter = exports.router = void 0;
const express_1 = require("express");
const typeorm_config_1 = require("../configs/typeorm.config");
const user_entity_1 = require("../entities/user.entity");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_types_1 = require("../types/error.types");
const meta_type_1 = require("../types/meta.type");
const user_services_1 = require("../services/user.services");
exports.router = (0, express_1.Router)();
const userService = new user_services_1.UserService();
const userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.router.use(auth_middleware_1.authMiddleware);
exports.router.post("/", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = userRepository.create(req.body);
    const result = yield userRepository.save(user);
    res.status(201).json({
        status: "success",
        data: result,
    });
})));
exports.router.get("/", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository.find();
    res.json({
        status: "success",
        data: users,
    });
})));
exports.router.get("/:id", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findOneBy({ id: req.params.id });
    if (!user) {
        throw new error_types_1.AppError("User not found", 404);
    }
    res.json({
        status: "success",
        data: user,
    });
})));
exports.router.patch("/:userId", auth_middleware_1.requireSelfOrAdmin, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const updateData = req.body;
    const user = yield userService.update(userId, updateData);
    res.json({
        status: "success",
        data: user,
    });
})));
exports.router.patch("/users/:userId/auth-level", (0, auth_middleware_1.requireAuth)(meta_type_1.UserType.ADMIN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userService = new user_services_1.UserService();
    const { userId } = req.params;
    const { newAuthLevel } = req.body;
    const updatedUser = yield userService.changeUserAuthLevel(userId, newAuthLevel);
    res.json(updatedUser);
}));
exports.router.delete("/:id", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findOneBy({ id: req.params.id });
    if (!user) {
        throw new error_types_1.AppError("User not found", 404);
    }
    yield userRepository.softRemove(user);
    res.json({
        status: "success",
        message: "User successfully deleted",
    });
})));
exports.userRouter = exports.router;
//# sourceMappingURL=user.routes.js.map