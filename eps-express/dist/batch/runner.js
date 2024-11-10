"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchRunner = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const UserCleanupJob_1 = require("./jobs/UserCleanupJob");
const logger_1 = require("../utils/logger");
class BatchRunner {
    constructor() {
        this.jobs = [
            new UserCleanupJob_1.UserCleanupJob(),
        ];
    }
    start() {
        this.jobs.forEach((job) => {
            node_cron_1.default.schedule(job.schedule, () => __awaiter(this, void 0, void 0, function* () {
                logger_1.logger.info(`Starting batch job: ${job.name}`);
                try {
                    yield job.execute();
                    logger_1.logger.info(`Successfully completed batch job: ${job.name}`);
                }
                catch (error) {
                    logger_1.logger.error(`Error in batch job ${job.name}:`, error);
                }
            }));
            logger_1.logger.info(`Scheduled batch job: ${job.name} with schedule: ${job.schedule}`);
        });
    }
    runJob(jobName) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = this.jobs.find((j) => j.name === jobName);
            if (!job) {
                throw new Error(`Job ${jobName} not found`);
            }
            logger_1.logger.info(`Manually starting batch job: ${jobName}`);
            yield job.execute();
        });
    }
}
exports.BatchRunner = BatchRunner;
//# sourceMappingURL=runner.js.map