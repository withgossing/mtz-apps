// src/middleware/error.middleware.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../types/error.types";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // TypeORM 에러 처리
  if ("code" in err) {
    const typeormError = err as Error & { code: string };
    if (typeormError.code === "23505") {
      res.status(409).json({
        status: "error",
        message: "Duplicate entry found",
      });
      return;
    }
  }

  // 기본 에러 응답
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
