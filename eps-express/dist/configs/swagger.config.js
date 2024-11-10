"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
exports.swaggerConfig = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express TypeORM API",
            version: "1.0.0",
            description: "API documentation for Express TypeORM project",
            contact: {
                name: "API Support",
                email: "support@example.com",
            },
        },
        servers: [
            {
                url: process.env.API_URL || "http://localhost:3000",
                description: "Local server",
            },
        ],
        components: {
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error",
                        },
                        message: {
                            type: "string",
                            example: "Error message",
                        },
                    },
                },
                BaseEntity: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                        deletedAt: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                        },
                        createdBy: {
                            type: "string",
                            format: "uuid",
                        },
                        updatedBy: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                        },
                        deletedBy: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/entities/*.ts"],
};
//# sourceMappingURL=swagger.config.js.map