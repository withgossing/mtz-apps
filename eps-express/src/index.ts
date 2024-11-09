import "reflect-metadata";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { userRouter } from "./routes/user.routes";
import { config } from "./configs/env.config";
import { AppDataSource } from "./configs/typeorm.config";
import { BatchRunner } from "./batch/runner";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "A simple Express API using TypeORM and Swagger",
    },
    servers: [
      {
        url: "http://localhost:" + config.server.port,
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/users", userRouter);

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
    console.log("Data Source has been initialized!");
    app.listen(config.server.port, () => {
      console.log("Server is running on http://localhost:3000");
      console.log(
        "Swagger documentation available at http://localhost:3000/api-docs"
      );
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});
