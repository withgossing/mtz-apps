import { Request } from "express";
import { logger } from "./logger";

export const logRequest = (
  req: Request,
  additionalInfo?: Record<string, any>
) => {
  if (!req.logged) {
    const requestInfo = {
      method: req.method,
      url: req.originalUrl,
      userId: req.headers["user-id"] || "anonymous",
      ...additionalInfo,
    };
    logger.info("Incoming request", requestInfo);
    req.logged = true;
  }
};

export const logRouteRegistration = (prefix: string, path: string) => {
  logger.debug(`Registered route: ${prefix}${path}`);
};

export const logRouteNotFound = (req: Request) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
};
