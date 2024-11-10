import { Router, Request, Response, NextFunction } from "express";
import { AppDataSource } from "../configs/typeorm.config";
import { User } from "../entities/user.entity";
import {
  authMiddleware,
  requireAuth,
  requireSelfOrAdmin,
} from "../middleware/auth.middleware";
import { AppError } from "../types/error.types";
import { UserType } from "../types/meta.type";
import { UserService } from "../services/user.services";
import { logger } from "../utils/logger";

export const router = Router();
const userService = new UserService();

const userRepository = AppDataSource.getRepository(User);

// 비동기 핸들러 래퍼
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 인증 미들웨어 적용
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: User's unique identifier
 *         userName:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         deptCode:
 *           type: string
 *           description: Department code
 *         authLevel:
 *           type: string
 *           enum: [ADMIN, MANAGER, USER]
 *           description: User's authorization level
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - userId
 *         - userName
 *         - email
 *         - deptCode
 *         - password
 *       properties:
 *         userId:
 *           type: string
 *           description: User's unique identifier
 *         userName:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         deptCode:
 *           type: string
 *           description: Department code
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         authLevel:
 *           type: string
 *           enum: [ADMIN, MANAGER, USER]
 *           default: USER
 *         isActive:
 *           type: boolean
 *           default: true
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         deptCode:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - userId: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique identifier
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *
 *   patch:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - userId: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's unique identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

// user 생성
router.post(
  "/",
  // requireAuth(UserType.ADMIN),
  asyncHandler(async (req, res) => {
    logger.info("Creating new user");

    const userData = req.body;

    // 필수 필드 검증
    const requiredFields = ["userId", "userName", "password", "email"];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // user 생성
    const user = await userService.create({
      ...userData,
      createdBy: req.user?.userId || "system",
    });

    // 비밀번호 필드 제외
    const { password, ...userWithoutPassword } = user;

    logger.info(`User created successfully: ${user.userId}`);

    res.status(201).json({
      status: "success",
      data: userWithoutPassword,
    });
  })
);

// user 목록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await userService.findAll();

    // 비밀번호 필드 제외
    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      status: "success",
      data: usersWithoutPassword,
    });
  })
);

// user 단건 조회 (id)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.findById(id);

    const { password, ...userWithoutPassword } = user;

    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({
      status: "success",
      data: userWithoutPassword,
    });
  })
);

// user 단건 조회 (userId)
router.get(
  "/userId/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await userService.findByUserId(userId);
    const { password, ...userWithoutPassword } = user;

    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({
      status: "success",
      data: userWithoutPassword,
    });
  })
);

// 사용자 수정
router.patch(
  "/:userId",
  requireSelfOrAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updateData = req.body;
    const user = await userService.update(userId, updateData);

    res.json({
      status: "success",
      data: user,
    });
  })
);

// 사용자 권한 수정
router.patch(
  "/users/:userId/auth-level",
  requireAuth(UserType.ADMIN),
  async (req, res) => {
    const userService = new UserService();
    const { userId } = req.params;
    const { newAuthLevel } = req.body;

    const updatedUser = await userService.changeUserAuthLevel(
      userId,
      newAuthLevel as UserType
    );

    res.json(updatedUser);
  }
);

// 사용자 삭제
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findOneBy({ id: req.params.id });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await userRepository.softRemove(user);
    res.json({
      status: "success",
      message: "User successfully deleted",
    });
  })
);

export const userRouter = router;
