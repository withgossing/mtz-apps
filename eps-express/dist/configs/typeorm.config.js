"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const env_config_1 = require("./env.config");
const options = {
    type: "postgres",
    host: env_config_1.config.database.host || "localhost",
    port: env_config_1.config.database.port || 5432,
    username: env_config_1.config.database.username || "mtzapps",
    password: env_config_1.config.database.password || "password",
    database: env_config_1.config.database.database || "testdb",
    synchronize: env_config_1.config.server.nodeEnv !== "production",
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
    cache: false,
    extra: {
        max: 20,
        connectionTimeoutMillis: 3000,
    },
};
exports.AppDataSource = new typeorm_1.DataSource(options);
//# sourceMappingURL=typeorm.config.js.map