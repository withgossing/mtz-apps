import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "./env.config";

const options: DataSourceOptions = {
  type: "postgres",
  host: config.database.host || "localhost",
  port: config.database.port || 5432,
  username: config.database.username || "mtzapps",
  password: config.database.password || "password",
  database: config.database.database || "testdb",
  synchronize: config.server.nodeEnv !== "production",
  // logging: config.server.nodeEnv !== "production",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  cache: false,
  extra: {
    max: 20, // 커넥션 풀 최대 크기
    connectionTimeoutMillis: 3000, // 커넥션 타임아웃
  },
};

export const AppDataSource = new DataSource(options);
