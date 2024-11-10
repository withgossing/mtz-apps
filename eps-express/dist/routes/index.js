"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("./user.routes");
const department_routes_1 = require("./department.routes");
const point_routes_1 = require("./point.routes");
const auth_middleware_1 = require("../middleware/auth.middleware");
const logger_1 = require("../utils/logger");
const logging_middleware_1 = require("middleware/logging.middleware");
const router = (0, express_1.Router)();
const API_PREFIX = "/api/v1";
const commonRoutes = [
    {
        path: "/users",
        router: user_routes_1.userRouter,
    },
];
const adminRoutes = [
    {
        path: "/departments",
        router: department_routes_1.departmentRouter,
    },
];
const userRoutes = [
    {
        path: "/point-balances",
        router: point_routes_1.pointRouter,
    },
];
router.use(logging_middleware_1.loggingMiddleware);
router.use(auth_middleware_1.authMiddleware);
const registerRoutes = (routes, prefix = "") => {
    routes.forEach(({ path, router: routeHandler }) => {
        const fullPath = `${API_PREFIX}${prefix}${path}`;
        router.use(fullPath, routeHandler);
        logger_1.logger.debug(`Registered route: ${fullPath}`);
    });
};
registerRoutes(commonRoutes);
registerRoutes(adminRoutes, "/admin");
registerRoutes(userRoutes, "/user");
router.use((req, res) => {
    logger_1.logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        status: "error",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map