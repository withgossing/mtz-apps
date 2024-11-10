import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserContextService } from "../utils/user-context";
import { UserService } from "../services/user.services";
import { UserType } from "../types/meta.type";
import { AppError } from "../types/error.types";
import { logger } from "../utils/logger";

declare module "express" {
  interface Request {
    logged?: boolean;
    user?: {
      userId: string;
      authLevel: UserType;
      deptCode: string;
    };
  }
}

// 기본 인증 미들웨어
export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.headers["user-id"] as string) || "system";
    const userService = new UserService();

    // system 사용자가 아닌 경우 사용자 정보 검증
    if (userId !== "system") {
      try {
        logger.info("userId:" + userId);
        const user = await userService.findByUserId(userId);
        logger.info("userId:" + user);
        if (!user.isActive) {
          throw new AppError("Inactive user", 403);
        }
        logger.info("userId:" + user);
        // 인증된 사용자 정보를 request 객체에 저장
        req.user = {
          userId: user.userId,
          authLevel: user.authLevel,
          deptCode: user.deptCode,
        };
        logger.info("userId:" + req.user);
      } catch (error) {
        logger.error(`Authentication failed for userId: ${userId}`);
        throw new AppError("Authentication failed", 401);
      }
    }

    // UserContext 설정
    await UserContextService.getInstance().run(userId, async () => {
      next();
    });
  } catch (error) {
    next(error);
  }
};

// 권한 레벨 검사 미들웨어
export const requireAuth = (requiredLevel: UserType): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const authLevelValues = {
        [UserType.ADMIN]: 3,
        [UserType.MANAGER]: 2,
        [UserType.USER]: 1,
      };

      if (
        authLevelValues[req.user.authLevel as UserType] <
        authLevelValues[requiredLevel]
      ) {
        logger.warn(
          `Access denied for user ${req.user.userId} - Required level: ${requiredLevel}, Current level: ${req.user.authLevel}`
        );
        throw new AppError("Insufficient permissions", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// 부서 접근 권한 검사 미들웨어
export const requireDepartmentAccess = (allowSameDeptOnly: boolean = true) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }

      const targetDeptCode = req.params.deptCode || req.body.deptCode;

      // 관리자는 모든 부서 접근 가능
      if (req.user.authLevel === UserType.ADMIN) {
        return next();
      }

      // 매니저는 자신의 부서만 접근 가능
      if (allowSameDeptOnly && req.user.authLevel === UserType.MANAGER) {
        if (req.user.deptCode !== targetDeptCode) {
          logger.warn(
            `Department access denied for user ${req.user.userId} to department ${targetDeptCode}`
          );
          throw new AppError("Department access denied", 403);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// 본인 또는 관리자 확인 미들웨어
export const requireSelfOrAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const targetUserId = req.params.userId || req.body.userId;

    if (
      req.user.authLevel === UserType.ADMIN ||
      req.user.userId === targetUserId
    ) {
      next();
    } else {
      logger.warn(
        `Access denied for user ${req.user.userId} to target user ${targetUserId}`
      );
      throw new AppError("Access denied", 403);
    }
  } catch (error) {
    next(error);
  }
};
