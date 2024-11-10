import { Router, Request, Response, NextFunction } from "express";
import { PointService } from "../services/point.service";
import { AppDataSource } from "../configs/typeorm.config";
import { PointBalance } from "../entities/point-balance.entity";
import { requireSelfOrAdmin } from "../middleware/auth.middleware";
import { AppError } from "../types/error.types";
import { logger } from "../utils/logger";

export const router = Router();
const pointService = new PointService();
const pointBalanceRepository = AppDataSource.getRepository(PointBalance);

// 비동기 핸들러 래퍼
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 잔고 생성
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const pointBalance = pointBalanceRepository.create(req.body);
    const result = await pointBalanceRepository.save(pointBalance);
    res.status(201).json({
      status: "success",
      data: result,
    });
  })
);

// 1. 잔고 기준 받은 포인트 조회
router.get(
  "/balance/:userId",
  requireSelfOrAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    logger.debug("/balance/" + req.params);
    const { userId } = req.params;
    const balance = await pointService.getReceivedPointBalance(userId);

    res.json({
      status: "success",
      data: balance,
    });
  })
);

// 2. 거래내역 기준 받은 포인트 합계 조회 (기간별)
router.get(
  "/transactions/:userId/received",
  requireSelfOrAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError("Start date and end date are required", 400);
    }

    const points = await pointService.getReceivedPointsByPeriod(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({
      status: "success",
      data: points,
    });
  })
);

// 3. 부서 내 포인트 순위 조회
router.get(
  "/department-rank/:userId",
  requireSelfOrAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const ranking = await pointService.getDepartmentPointRanking(userId);

    res.json({
      status: "success",
      data: ranking,
    });
  })
);

export const pointRouter = router;
