// src/batch/runner.ts
import cron from "node-cron";
import { BatchJob } from "./jobs/BatchJob";
import { UserCleanupJob } from "./jobs/UserCleanupJob";
import { logger } from "../utils/logger";

export class BatchRunner {
  private jobs: BatchJob[] = [
    new UserCleanupJob(),
    // 여기에 더 많은 배치 작업을 추가할 수 있습니다
  ];

  start() {
    this.jobs.forEach((job) => {
      cron.schedule(job.schedule, async () => {
        logger.info(`Starting batch job: ${job.name}`);
        try {
          await job.execute();
          logger.info(`Successfully completed batch job: ${job.name}`);
        } catch (error) {
          logger.error(`Error in batch job ${job.name}:`, error);
        }
      });
      logger.info(
        `Scheduled batch job: ${job.name} with schedule: ${job.schedule}`
      );
    });
  }

  // 수동으로 특정 작업을 실행하는 메서드
  async runJob(jobName: string) {
    const job = this.jobs.find((j) => j.name === jobName);
    if (!job) {
      throw new Error(`Job ${jobName} not found`);
    }

    logger.info(`Manually starting batch job: ${jobName}`);
    await job.execute();
  }
}
