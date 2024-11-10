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
exports.pointRouter = exports.router = void 0;
const express_1 = require("express");
const point_service_1 = require("../services/point.service");
const typeorm_config_1 = require("../configs/typeorm.config");
const point_balance_entity_1 = require("../entities/point-balance.entity");
const auth_middleware_1 = require("../middleware/auth.middleware");
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
exports.router = (0, express_1.Router)();
const pointService = new point_service_1.PointService();
const pointBalanceRepository = typeorm_config_1.AppDataSource.getRepository(point_balance_entity_1.PointBalance);
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.router.post("/", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pointBalance = pointBalanceRepository.create(req.body);
    const result = yield pointBalanceRepository.save(pointBalance);
    res.status(201).json({
        status: "success",
        data: result,
    });
})));
exports.router.get("/balance/:userId", auth_middleware_1.requireSelfOrAdmin, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.debug("/balance/" + req.params);
    const { userId } = req.params;
    const balance = yield pointService.getReceivedPointBalance(userId);
    res.json({
        status: "success",
        data: balance,
    });
})));
exports.router.get("/transactions/:userId/received", auth_middleware_1.requireSelfOrAdmin, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        throw new error_types_1.AppError("Start date and end date are required", 400);
    }
    const points = yield pointService.getReceivedPointsByPeriod(userId, new Date(startDate), new Date(endDate));
    res.json({
        status: "success",
        data: points,
    });
})));
exports.router.get("/department-rank/:userId", auth_middleware_1.requireSelfOrAdmin, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const ranking = yield pointService.getDepartmentPointRanking(userId);
    res.json({
        status: "success",
        data: ranking,
    });
})));
exports.pointRouter = exports.router;
//# sourceMappingURL=point.routes.js.map