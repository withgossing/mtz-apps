"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRouteNotFound = exports.logRouteRegistration = exports.logRequest = void 0;
const logger_1 = require("./logger");
const logRequest = (req, additionalInfo) => {
    if (!req.logged) {
        const requestInfo = Object.assign({ method: req.method, url: req.originalUrl, userId: req.headers["user-id"] || "anonymous" }, additionalInfo);
        logger_1.logger.info("Incoming request", requestInfo);
        req.logged = true;
    }
};
exports.logRequest = logRequest;
const logRouteRegistration = (prefix, path) => {
    logger_1.logger.debug(`Registered route: ${prefix}${path}`);
};
exports.logRouteRegistration = logRouteRegistration;
const logRouteNotFound = (req) => {
    logger_1.logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
};
exports.logRouteNotFound = logRouteNotFound;
//# sourceMappingURL=logger-utils.js.map