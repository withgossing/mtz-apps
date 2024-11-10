"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequestDetails = exports.requestLogger = void 0;
const logger_1 = require("../utils/logger");
const requestLogger = (req, res, next) => {
    if (!req.logged) {
        const requestInfo = {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userId: req.headers["user-id"] || "anonymous",
        };
        logger_1.logger.info("Incoming request", requestInfo);
        req.logged = true;
    }
    next();
};
exports.requestLogger = requestLogger;
const logRequestDetails = (req, message, additionalInfo) => {
    if (!req.logged) {
        logger_1.logger.debug(`${message} | ${req.method} ${req.originalUrl}`, additionalInfo);
        req.logged = true;
    }
};
exports.logRequestDetails = logRequestDetails;
//# sourceMappingURL=request-logger.middleware.js.map