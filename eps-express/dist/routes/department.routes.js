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
exports.departmentRouter = exports.router = void 0;
const express_1 = require("express");
const department_service_1 = require("../services/department.service");
const typeorm_config_1 = require("../configs/typeorm.config");
const department_entity_1 = require("../entities/department.entity");
exports.router = (0, express_1.Router)();
const departmentService = new department_service_1.DepartmentService();
const departmentRepository = typeorm_config_1.AppDataSource.getRepository(department_entity_1.Department);
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.router.post("/", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const department = departmentRepository.create(req.body);
    const result = yield departmentRepository.save(department);
    res.status(201).json({
        status: "success",
        data: result,
    });
})));
exports.departmentRouter = exports.router;
//# sourceMappingURL=department.routes.js.map