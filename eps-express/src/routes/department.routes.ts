import { Router, Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service";
import { AppDataSource } from "../configs/typeorm.config";
import { Department } from "../entities/department.entity";
import { requireAuth } from "../middleware/auth.middleware";
import { UserType } from "../types/meta.type";
import { logger } from "../utils/logger";
import { AppError } from "../types/error.types";

export const router = Router();
const departmentService = new DepartmentService();
const departmentRepository = AppDataSource.getRepository(Department);

// 비동기 핸들러 래퍼
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// department 생성
router.post(
  "/",
  // requireAuth(UserType.ADMIN),
  asyncHandler(async (req, res) => {
    logger.info("Creating new user");

    const departmentData = req.body;

    // 필수 필드 검증
    const requiredFields = ["deptCode", "deptName"];
    const missingFields = requiredFields.filter(
      (field) => !departmentData[field]
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // department 생성
    const department = await departmentService.create({
      ...departmentData,
      createdBy: req.user?.userId || "system",
    });

    logger.info(`User created successfully: ${department.deptCode}`);

    res.status(201).json({
      status: "success",
      data: department,
    });
  })
);

// department 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const departments = await departmentService.findAll();

    res.json({
      status: "success",
      data: departments,
    });
  })
);

// department 단건 조회 (id)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await departmentService.findById(id);

    if (!department) {
      throw new AppError("Department not found", 404);
    }
    res.json({
      status: "success",
      data: department,
    });
  })
);

// department 단건 조회 (deptCode)
router.get(
  "/deptCode/:deptCode",
  asyncHandler(async (req, res) => {
    const { deptCode } = req.params;
    const department = await departmentService.findByDeptCode(deptCode);

    if (!department) {
      throw new AppError("Department not found", 404);
    }
    res.json({
      status: "success",
      data: department,
    });
  })
);

export const departmentRouter = router;
