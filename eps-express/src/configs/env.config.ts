// src/config/env.config.ts
import dotenv from "dotenv";
import path from "path";

// .env 파일 로드
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production" ? ".env" : ".env.development"
  ),
});

export const config = {
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

// 환경변수 유효성 검사
const validateEnv = () => {
  const required = ["DB_USERNAME", "DB_PASSWORD"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// 프로덕션 환경에서는 필수 환경변수 체크
if (process.env.NODE_ENV === "production") {
  validateEnv();
}
