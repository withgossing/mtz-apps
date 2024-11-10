import { SwaggerDefinition } from "swagger-jsdoc";
import { config } from "./env.config";

export const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API Documentation",
      version: "1.0.0",
      description: "API documentation for Express TypeORM Project",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:" + config.server.port,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        userId: {
          type: "apiKey",
          in: "header",
          name: "user-id",
          description: "User ID for authentication",
        },
      },
    },
    security: [
      {
        userId: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/entities/*.ts"],
  explorer: true,
};
