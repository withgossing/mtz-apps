import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

declare module "express" {
  interface Request {
    logged?: boolean;
  }
}

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.logged) {
    const requestInfo = {
      method: req.method,
      path: req.originalUrl,
      userId: req.headers["user-id"] || "anonymous",
      timestamp: new Date().toISOString(),
    };

    logger.info("Incoming request", requestInfo);
    req.logged = true;
  }
  next();
};
