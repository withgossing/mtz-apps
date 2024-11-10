import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { swaggerConfig } from "../configs/swagger.config";
import { logger } from "../utils/logger";

export const setupSwagger = (app: Application): void => {
  try {
    const swaggerSpec = swaggerJSDoc(swaggerConfig);

    // Swagger UI 옵션
    const swaggerUiOptions = {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API Documentation",
      customfavIcon: "/assets/favicon.ico",
    };

    // Swagger 문서 JSON으로 제공
    app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    // Swagger UI 설정
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerUiOptions)
    );
    logger.info("Swagger documentation initialized");
  } catch (error) {
    logger.error("Error initializing Swagger:", error);
  }
};
