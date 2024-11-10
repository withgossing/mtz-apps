"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeORMError = exports.isAppError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const isAppError = (error) => {
    return error instanceof AppError;
};
exports.isAppError = isAppError;
const isTypeORMError = (error) => {
    return error instanceof Error && "code" in error;
};
exports.isTypeORMError = isTypeORMError;
//# sourceMappingURL=error.types.js.map