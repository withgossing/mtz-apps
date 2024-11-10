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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCleanupJob = void 0;
const typeorm_config_1 = require("../../configs/typeorm.config");
const user_entity_1 = require("../../entities/user.entity");
const logger_1 = require("../../utils/logger");
class UserCleanupJob {
    constructor() {
        this.name = "UserCleanupJob";
        this.schedule = "0 0 * * *";
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const result = yield userRepository
                    .createQueryBuilder()
                    .update(user_entity_1.User)
                    .set({ isActive: false })
                    .where("lastLoginDate < :date", { date: thirtyDaysAgo })
                    .execute();
                logger_1.logger.info(`UserCleanupJob completed: ${result.affected} users processed`);
            }
            catch (error) {
                logger_1.logger.error("Error in UserCleanupJob:", error);
                throw error;
            }
        });
    }
}
exports.UserCleanupJob = UserCleanupJob;
//# sourceMappingURL=UserCleanupJob.js.map