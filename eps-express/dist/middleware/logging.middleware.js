"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const logger_1 = require("../utils/logger");
const loggingMiddleware = (req, res, next) => {
    if (!req.logged) {
        const requestInfo = {
            method: req.method,
            path: req.originalUrl,
            userId: req.headers["user-id"] || "anonymous",
            timestamp: new Date().toISOString(),
        };
        logger_1.logger.info("Incoming request", requestInfo);
        req.logged = true;
    }
    next();
};
exports.loggingMiddleware = loggingMiddleware;
//# sourceMappingURL=logging.middleware.js.map