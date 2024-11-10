import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware";
import { setupSwagger } from "./middleware/swagger.middleware";
import { config } from "./configs/env.config";
import { AppDataSource } from "./configs/typeorm.config";
import { BatchRunner } from "./batch/runner";
import { httpLogger } from "./middleware/http-logger.middleware";
import { logger } from "./utils/logger";
import routes from "./routes";
import { requestLogger } from "./middleware/request-logger.middleware";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger 설정
setupSwagger(app);

// Routes
app.use("/", routes);

// 로거
app.use(httpLogger);
app.use(requestLogger);

// 에러 핸들러
app.use(errorHandler);

// 존재하지 않는 라우트 처리
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Batch job endpoint
app.post("/batch/:jobName/run", async (req, res) => {
  try {
    const { jobName } = req.params;
    await batchRunner.runJob(jobName);
    res.json({ message: `Successfully executed job: ${jobName}` });
  } catch (err) {
    const error = err as Error; // Type assertion
    logger.error("Error running batch job:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An unknown error occurred",
    });
  }
});

const batchRunner = new BatchRunner();

// Initialize database connection and start server
AppDataSource.initialize()
  .then(() => {
    logger.info("Database initialized");

    app.listen(config.server.port, () => {
      logger.info(
        "Server is running on http://localhost:" + config.server.port
      );
      logger.info(
        "API Documentation available at http://localhost:" +
          config.server.port +
          "/api-docs"
      );
    });
  })
  .catch((err) => {
    logger.error(
      "Error during initialization:",
      err instanceof Error ? err.message : "Unknown error"
    );
    process.exit(1);
  });

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

// 처리되지 않은 Promise 거부 처리
process.on("unhandledRejection", (err: unknown) => {
  logger.error(
    "Unhandled Rejection:",
    err instanceof Error ? err.message : "Unknown error"
  );
  process.exit(1);
});

// 처리되지 않은 예외 처리
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err.message);
  process.exit(1);
});
