"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_types_1 = require("../types/error.types");
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error("Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    if (err instanceof error_types_1.AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
        return;
    }
    if ("code" in err) {
        const typeormError = err;
        if (typeormError.code === "23505") {
            res.status(409).json({
                status: "error",
                message: "Duplicate entry found",
            });
            return;
        }
    }
    res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map