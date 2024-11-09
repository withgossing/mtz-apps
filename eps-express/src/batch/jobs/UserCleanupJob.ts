import { BatchJob } from "./BatchJob";
import { AppDataSource } from "../../configs/typeorm.config";
import { User } from "../../entities/user.entity";
import { logger } from "../../utils/logger";

export class UserCleanupJob implements BatchJob {
  name = "UserCleanupJob";
  schedule = "0 0 * * *"; // 매일 자정에 실행

  async execute(): Promise<void> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      // 30일 이상 로그인하지 않은 사용자 처리 예시
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await userRepository
        .createQueryBuilder()
        .update(User)
        .set({ isActive: false })
        .where("lastLoginDate < :date", { date: thirtyDaysAgo })
        .execute();

      logger.info(
        `UserCleanupJob completed: ${result.affected} users processed`
      );
    } catch (error) {
      logger.error("Error in UserCleanupJob:", error);
      throw error;
    }
  }
}
