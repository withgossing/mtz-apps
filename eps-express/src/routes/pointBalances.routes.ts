import { Router, Request, Response, NextFunction } from "express";
import { PointBalanceService } from "../services/pointBalance.service";
import { AppDataSource } from "../configs/typeorm.config";
import { PointBalance } from "../entities/point-balances.entity";
import { requireAuth, requireSelfOrAdmin } from "../middleware/auth.middleware";
import { AppError } from "../types/error.types";
import { logger } from "../utils/logger";
import { UserType } from "../types/meta.type";

export const router = Router();
const pointBalanceService = new PointBalanceService();
const pointBalanceRepository = AppDataSource.getRepository(PointBalance);

// 비동기 핸들러 래퍼
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// pointBalance 생성
router.post(
  "/",
  // requireAuth(UserType.ADMIN),
  asyncHandler(async (req, res) => {
    logger.info("Creating new pointBalance");

    const pointBalancesData = req.body;

    // 필수 필드 검증
    const requiredFields = ["userId", "pointType"];
    const missingFields = requiredFields.filter(
      (field) => !pointBalancesData[field]
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const pointBalances = await pointBalanceService.create({
      ...pointBalancesData,
      createdBy: req.user?.userId || "system",
    });

    logger.info(`User created successfully: ${pointBalances.userId}`);

    res.status(201).json({
      status: "success",
      data: pointBalances,
    });
  })
);

// department 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const pointBalances = await pointBalanceService.findAll();

    res.json({
      status: "success",
      data: pointBalances,
    });
  })
);

// department 단건 조회 (id)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await pointBalanceService.findById(id);

    if (!department) {
      throw new AppError("Department not found", 404);
    }
    res.json({
      status: "success",
      data: department,
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
    const balance = await pointBalanceService.getReceivedPointBalance(userId);

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

    const points = await pointBalanceService.getReceivedPointsByPeriod(
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
    const ranking = await pointBalanceService.getDepartmentPointRanking(userId);

    res.json({
      status: "success",
      data: ranking,
    });
  })
);

export const pointBalancesRouter = router;
