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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const error_middleware_1 = require("./middleware/error.middleware");
const swagger_middleware_1 = require("./middleware/swagger.middleware");
const env_config_1 = require("./configs/env.config");
const typeorm_config_1 = require("./configs/typeorm.config");
const runner_1 = require("./batch/runner");
const http_logger_middleware_1 = require("./middleware/http-logger.middleware");
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./routes"));
const request_logger_middleware_1 = require("./middleware/request-logger.middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, swagger_middleware_1.setupSwagger)(app);
app.use(http_logger_middleware_1.httpLogger);
app.use(request_logger_middleware_1.requestLogger);
app.use(error_middleware_1.errorHandler);
app.use(routes_1.default);
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});
app.post("/batch/:jobName/run", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobName } = req.params;
        yield batchRunner.runJob(jobName);
        res.json({ message: `Successfully executed job: ${jobName}` });
    }
    catch (err) {
        const error = err;
        logger_1.logger.error("Error running batch job:", error);
        res.status(500).json({
            status: "error",
            message: error.message || "An unknown error occurred",
        });
    }
}));
const batchRunner = new runner_1.BatchRunner();
typeorm_config_1.AppDataSource.initialize()
    .then(() => {
    logger_1.logger.info("Database initialized");
    app.listen(env_config_1.config.server.port, () => {
        logger_1.logger.info("Server is running on http://localhost:" + env_config_1.config.server.port);
        logger_1.logger.info("API Documentation available at http://localhost:" +
            env_config_1.config.server.port +
            "/api-docs");
    });
})
    .catch((err) => {
    logger_1.logger.error("Error during initialization:", err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
});
process.on("SIGTERM", () => {
    logger_1.logger.info("SIGTERM signal received: closing HTTP server");
    process.exit(0);
});
process.on("unhandledRejection", (err) => {
    logger_1.logger.error("Unhandled Rejection:", err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    logger_1.logger.error("Uncaught Exception:", err.message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map