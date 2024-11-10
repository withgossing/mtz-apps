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
exports.PointService = void 0;
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../configs/typeorm.config");
const point_balance_entity_1 = require("../entities/point-balance.entity");
const point_transaction_entity_1 = require("../entities/point-transaction.entity");
const user_entity_1 = require("../entities/user.entity");
const meta_type_1 = require("../types/meta.type");
const error_types_1 = require("../types/error.types");
const department_entity_1 = require("../entities/department.entity");
class PointService {
    constructor() {
        this.pointBalanceRepository = typeorm_config_1.AppDataSource.getRepository(point_balance_entity_1.PointBalance);
        this.pointTransactionRepository =
            typeorm_config_1.AppDataSource.getRepository(point_transaction_entity_1.PointTransaction);
        this.userRepository = typeorm_config_1.AppDataSource.getRepository(user_entity_1.User);
        this.departmentRepository = typeorm_config_1.AppDataSource.getRepository(department_entity_1.Department);
        this.dataSource = typeorm_config_1.AppDataSource;
    }
    getUserWithDepartment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { userId } });
            if (!user) {
                throw new error_types_1.AppError("User not found", 404);
            }
            const department = yield this.departmentRepository.findOne({
                where: { deptCode: user.deptCode },
            });
            if (!department) {
                throw new error_types_1.AppError("Department not found", 404);
            }
            return {
                userName: user.userName,
                deptName: department.deptName,
            };
        });
    }
    getTransactionWithUserInfo(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.pointTransactionRepository.findOne({
                where: { id: transactionId },
            });
            if (!transaction) {
                throw new error_types_1.AppError("Transaction not found", 404);
            }
            const [sender, receiver] = yield Promise.all([
                this.getUserWithDepartment(transaction.senderUserId),
                this.getUserWithDepartment(transaction.receiverUserId),
            ]);
            return {
                transaction,
                sender,
                receiver,
            };
        });
    }
    getDepartmentTransactions(deptCode, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find({
                where: { deptCode },
            });
            const userIds = users.map((user) => user.userId);
            const transactions = yield this.pointTransactionRepository.find({
                where: [{ senderUserId: (0, typeorm_1.In)(userIds) }, { receiverUserId: (0, typeorm_1.In)(userIds) }],
                order: { transactionDate: "DESC" },
            });
            const results = yield Promise.all(transactions.map((transaction) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    transaction,
                    sender: yield this.getUserWithDepartment(transaction.senderUserId),
                    receiver: yield this.getUserWithDepartment(transaction.receiverUserId),
                });
            })));
            return results;
        });
    }
    getDepartmentPointStats(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find({
                where: { deptCode, isActive: true },
            });
            const userIds = users.map((user) => user.userId);
            const transactions = yield this.pointTransactionRepository.find({
                where: [{ senderUserId: (0, typeorm_1.In)(userIds) }, { receiverUserId: (0, typeorm_1.In)(userIds) }],
            });
            return {
                totalReceived: transactions
                    .filter((t) => userIds.includes(t.receiverUserId))
                    .reduce((sum, t) => sum + t.points, 0),
                totalGiven: transactions
                    .filter((t) => userIds.includes(t.senderUserId))
                    .reduce((sum, t) => sum + t.points, 0),
                activeUsers: users.length,
            };
        });
    }
    initializeUserPoints(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { userId } });
            if (!user) {
                throw new error_types_1.AppError("User not found", 404);
            }
            yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                yield manager.save(point_balance_entity_1.PointBalance, {
                    userId,
                    pointType: meta_type_1.PointType.RECEIVED,
                    balance: 0,
                    lastUpdatedAt: new Date(),
                });
                yield manager.save(point_balance_entity_1.PointBalance, {
                    userId,
                    pointType: meta_type_1.PointType.AVAILABLE,
                    balance: 100,
                    lastUpdatedAt: new Date(),
                });
            }));
        });
    }
    givePoints(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderUserId, receiverUserId, points, reasonCode, reasonDetail } = data;
            if (points <= 0) {
                throw new error_types_1.AppError("Points must be greater than 0", 400);
            }
            if (senderUserId === receiverUserId) {
                throw new error_types_1.AppError("Cannot give points to yourself", 400);
            }
            return yield this.dataSource.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                const senderBalance = yield manager.findOne(point_balance_entity_1.PointBalance, {
                    where: {
                        userId: senderUserId,
                        pointType: meta_type_1.PointType.AVAILABLE,
                    },
                });
                if (!senderBalance || senderBalance.balance < points) {
                    throw new error_types_1.AppError("Insufficient points", 400);
                }
                let receiverBalance = yield manager.findOne(point_balance_entity_1.PointBalance, {
                    where: {
                        userId: receiverUserId,
                        pointType: meta_type_1.PointType.RECEIVED,
                    },
                });
                const transaction = yield manager.save(point_transaction_entity_1.PointTransaction, {
                    senderUserId,
                    receiverUserId,
                    transactionDate: new Date(),
                    reasonCode,
                    reasonDetail,
                    points,
                });
                senderBalance.balance -= points;
                senderBalance.lastUpdatedAt = new Date();
                yield manager.save(senderBalance);
                if (receiverBalance) {
                    receiverBalance.balance += points;
                    receiverBalance.lastUpdatedAt = new Date();
                    yield manager.save(receiverBalance);
                }
                else {
                    yield manager.save(point_balance_entity_1.PointBalance, {
                        userId: receiverUserId,
                        pointType: meta_type_1.PointType.RECEIVED,
                        balance: points,
                        lastUpdatedAt: new Date(),
                    });
                }
                return transaction;
            }));
        });
    }
    getReceivedPointBalance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.pointBalanceRepository.findOne({
                where: {
                    userId,
                    pointType: meta_type_1.PointType.RECEIVED,
                },
            });
            if (!balance) {
                return {
                    userId,
                    balance: 0,
                    lastUpdatedAt: new Date(),
                };
            }
            return {
                userId,
                balance: balance.balance,
                lastUpdatedAt: balance.lastUpdatedAt,
            };
        });
    }
    getUserPointBalances(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pointBalanceRepository.find({
                where: { userId },
            });
        });
    }
    getReceivedPointsByPeriod(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.pointTransactionRepository
                .createQueryBuilder("transaction")
                .where("transaction.receiverUserId = :userId", { userId })
                .andWhere("transaction.transactionDate BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            })
                .getMany();
            const totalPoints = transactions.reduce((sum, tx) => sum + tx.points, 0);
            return {
                totalPoints,
                transactions,
            };
        });
    }
    getDepartmentPointRanking(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield this.userRepository.findOne({
                where: { userId },
            });
            if (!user) {
                throw new error_types_1.AppError("User not found", 404);
            }
            const departmentUsers = yield this.userRepository.find({
                where: { deptCode: user.deptCode },
            });
            const userPoints = yield Promise.all(departmentUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                const points = yield this.pointTransactionRepository
                    .createQueryBuilder("transaction")
                    .select("SUM(transaction.points)", "total")
                    .where("transaction.receiverUserId = :userId", {
                    userId: user.userId,
                })
                    .getRawOne();
                return {
                    userId: user.userId,
                    points: Number(points.total) || 0,
                };
            })));
            userPoints.sort((a, b) => b.points - a.points);
            const totalUsers = userPoints.length;
            const userRank = userPoints.findIndex((p) => p.userId === userId) + 1;
            const totalPoints = ((_a = userPoints.find((p) => p.userId === userId)) === null || _a === void 0 ? void 0 : _a.points) || 0;
            const departmentTotal = userPoints.reduce((sum, p) => sum + p.points, 0);
            const departmentAverage = departmentTotal / totalUsers;
            const percentile = ((totalUsers - userRank) / totalUsers) * 100;
            return {
                totalPoints,
                rank: userRank,
                percentile: Math.round(percentile * 100) / 100,
                totalUsers,
                departmentAverage: Math.round(departmentAverage * 100) / 100,
            };
        });
    }
    getDepartmentPointStatsRank(deptCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find({
                where: { deptCode },
            });
            const userPoints = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                const points = yield this.pointTransactionRepository
                    .createQueryBuilder("transaction")
                    .select("SUM(transaction.points)", "total")
                    .where("transaction.receiverUserId = :userId", {
                    userId: user.userId,
                })
                    .getRawOne();
                return {
                    userId: user.userId,
                    points: Number(points.total) || 0,
                };
            })));
            const totalPoints = userPoints.reduce((sum, p) => sum + p.points, 0);
            const averagePoints = totalPoints / users.length;
            const topReceivers = [...userPoints]
                .sort((a, b) => b.points - a.points)
                .slice(0, 5);
            return {
                totalPoints,
                averagePoints: Math.round(averagePoints * 100) / 100,
                topReceivers,
            };
        });
    }
    getPointTransactionHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pointTransactionRepository.find({
                where: [{ senderUserId: userId }, { receiverUserId: userId }],
                relations: ["senderUser", "receiverUser"],
                order: {
                    transactionDate: "DESC",
                },
            });
        });
    }
    getMonthlyPointStats(userId, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            const transactions = yield this.pointTransactionRepository.find({
                where: [
                    { senderUserId: userId, transactionDate: (0, typeorm_1.Between)(startDate, endDate) },
                    {
                        receiverUserId: userId,
                        transactionDate: (0, typeorm_1.Between)(startDate, endDate),
                    },
                ],
                relations: ["senderUser", "receiverUser"],
            });
            const pointsGiven = transactions
                .filter((t) => t.senderUserId === userId)
                .reduce((sum, t) => sum + t.points, 0);
            const pointsReceived = transactions
                .filter((t) => t.receiverUserId === userId)
                .reduce((sum, t) => sum + t.points, 0);
            return {
                pointsGiven,
                pointsReceived,
                transactions,
            };
        });
    }
    getPointStatsByPeriod(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.pointTransactionRepository.find({
                where: [
                    { senderUserId: userId, transactionDate: (0, typeorm_1.Between)(startDate, endDate) },
                    {
                        receiverUserId: userId,
                        transactionDate: (0, typeorm_1.Between)(startDate, endDate),
                    },
                ],
                relations: ["senderUser", "receiverUser"],
            });
            const pointsGiven = transactions
                .filter((t) => t.senderUserId === userId)
                .reduce((sum, t) => sum + t.points, 0);
            const pointsReceived = transactions
                .filter((t) => t.receiverUserId === userId)
                .reduce((sum, t) => sum + t.points, 0);
            return {
                pointsGiven,
                pointsReceived,
                transactions,
            };
        });
    }
    getBalanceUpdateHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pointBalanceRepository.find({
                where: { userId },
                order: { lastUpdatedAt: "DESC" },
            });
        });
    }
}
exports.PointService = PointService;
//# sourceMappingURL=point.service.js.map