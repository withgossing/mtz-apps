import { Router, Request, Response, NextFunction } from "express";
import { DepartmentService } from "../services/department.service";
import { AppDataSource } from "../configs/typeorm.config";
import { Department } from "../entities/department.entity";

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

// 부서 생성
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const department = departmentRepository.create(req.body);
    const result = await departmentRepository.save(department);
    res.status(201).json({
      status: "success",
      data: result,
    });
  })
);

export const departmentRouter = router;
