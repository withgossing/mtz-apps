import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { loggingMiddleware } from "../middleware/logging.middleware";
import { logger } from "../utils/logger";

import { userRouter } from "./user.routes";
import { departmentRouter } from "./department.routes";
import { pointRouter } from "./point.routes";

const router = Router();

// API 버전 접두사
const API_PREFIX = "/api/v1";

// 공통 라우트 (인증 필요)
const commonRoutes = [
  {
    path: "/users",
    router: userRouter,
  },
];

// 관리자 전용 라우트
const adminRoutes = [
  {
    path: "/departments",
    router: departmentRouter,
  },
];

// 사용자 전용 라우트
const userRoutes = [
  {
    path: "/points",
    router: pointRouter,
  },
];

// 공통 미들웨어
router.use(loggingMiddleware);
router.use(authMiddleware);

// 라우트 등록 함수
const registerRoutes = (
  routes: Array<{ path: string; router: Router }>,
  prefix: string = ""
) => {
  routes.forEach(({ path, router: routeHandler }) => {
    const fullPath = `${API_PREFIX}${prefix}${path}`;
    router.use(fullPath, routeHandler);
    logger.debug(`Registered route: ${fullPath}`);
  });
};

// 라우트 등록
registerRoutes(commonRoutes);
registerRoutes(adminRoutes, "/admin");
registerRoutes(userRoutes, "/user");

// 404 처리
router.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default router;
