import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

declare module "express" {
  interface Request {
    logged?: boolean;
  }
}

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.logged) {
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.headers["user-id"] || "anonymous",
    };

    logger.info("Incoming request", requestInfo);
    req.logged = true;
  }
  next();
};

// 상세 로깅을 위한 유틸리티 함수
export const logRequestDetails = (
  req: Request,
  message: string,
  additionalInfo?: Record<string, any>
) => {
  if (!req.logged) {
    logger.debug(
      `${message} | ${req.method} ${req.originalUrl}`,
      additionalInfo
    );
    req.logged = true;
  }
};
