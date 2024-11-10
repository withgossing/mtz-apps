import winston from "winston";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const logDir = "logs";

// 환경별 로그 레벨 설정
const getLogLevel = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "info";
    case "development":
      return "debug";
    case "test":
      return "error";
    default:
      return "info";
  }
};

// 커스텀 로그 포맷 정의
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] - ${message}`;
});

// 로거 설정
export const logger = winston.createLogger({
  level: getLogLevel(),
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat
  ),
  transports: [
    // 에러 로그
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    // 전체 로그
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// 개발 환경에서만 콘솔 출력 추가 (중복 출력 방지)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}] - ${message}`;
        })
      ),
    })
  );
}

// 로그 레벨별 메서드 정의 (중복 방지를 위해 직접 logger 인스턴스 사용)
export const logInfo = (message: string) => {
  logger.info(message);
};

export const logError = (message: string, error?: Error) => {
  if (error) {
    logger.error(`${message} - ${error.message}\n${error.stack}`);
  } else {
    logger.error(message);
  }
};

export const logWarn = (message: string) => {
  logger.warn(message);
};

export const logDebug = (message: string) => {
  logger.debug(message);
};

// HTTP 요청 로깅을 위한 포맷터
export const httpLogFormat = (req: any, res: any) => {
  return `${req.method} ${req.url} ${res.statusCode} - ${req.ip}`;
};
