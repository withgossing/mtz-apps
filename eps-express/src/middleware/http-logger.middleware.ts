import { Request, Response, NextFunction } from "express";
import { logger, httpLogFormat } from "../utils/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // 응답 완료 시점에 로깅
  res.on("finish", () => {
    const message = httpLogFormat(req, res);

    // 상태 코드에 따른 로그 레벨 결정
    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};
