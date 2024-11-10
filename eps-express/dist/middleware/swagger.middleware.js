"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("../configs/swagger.config");
const setupSwagger = (app) => {
    const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_config_1.swaggerConfig);
    const swaggerUiOptions = {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "API Documentation",
        customfavIcon: "/assets/favicon.ico",
    };
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, swaggerUiOptions));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.middleware.js.map