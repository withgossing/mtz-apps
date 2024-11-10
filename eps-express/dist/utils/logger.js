"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogFormat = exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const logDir = "logs";
const getLogLevel = () => {
    switch (process.env.NODE_ENV) {
        case "production":
            return "info";
        case "development":
            return "debug";
        case "test":
            return "error";
        default:
            return "info";
    }
};
const customFormat = winston_1.default.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}] - ${message}`;
});
exports.logger = winston_1.default.createLogger({
    level: getLogLevel(),
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), customFormat),
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "error.log"),
            level: "error",
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "combined.log"),
        }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }), winston_1.default.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level}] - ${message}`;
        })),
    }));
}
const logInfo = (message) => {
    exports.logger.info(message);
};
exports.logInfo = logInfo;
const logError = (message, error) => {
    if (error) {
        exports.logger.error(`${message} - ${error.message}\n${error.stack}`);
    }
    else {
        exports.logger.error(message);
    }
};
exports.logError = logError;
const logWarn = (message) => {
    exports.logger.warn(message);
};
exports.logWarn = logWarn;
const logDebug = (message) => {
    exports.logger.debug(message);
};
exports.logDebug = logDebug;
const httpLogFormat = (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${req.ip}`;
};
exports.httpLogFormat = httpLogFormat;
//# sourceMappingURL=logger.js.map