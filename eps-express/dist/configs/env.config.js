"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), process.env.NODE_ENV === "production" ? ".env" : ".env.development"),
});
exports.config = {
    database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_DATABASE || "testdb",
    },
    server: {
        port: parseInt(process.env.PORT || "3000", 10),
        nodeEnv: process.env.NODE_ENV || "development",
    },
    logging: {
        level: process.env.LOG_LEVEL || "info",
    },
};
const validateEnv = () => {
    const required = ["DB_USERNAME", "DB_PASSWORD"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};
if (process.env.NODE_ENV === "production") {
    validateEnv();
}
//# sourceMappingURL=env.config.js.map