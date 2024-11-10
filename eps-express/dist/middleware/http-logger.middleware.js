"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const logger_1 = require("../utils/logger");
const httpLogger = (req, res, next) => {
    res.on("finish", () => {
        const message = (0, logger_1.httpLogFormat)(req, res);
        if (res.statusCode >= 500) {
            logger_1.logger.error(message);
        }
        else if (res.statusCode >= 400) {
            logger_1.logger.warn(message);
        }
        else {
            logger_1.logger.info(message);
        }
    });
    next();
};
exports.httpLogger = httpLogger;
//# sourceMappingURL=http-logger.middleware.js.map