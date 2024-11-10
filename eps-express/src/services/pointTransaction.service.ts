import { Between, DataSource, In, Repository } from "typeorm";
import { PointReasonCode } from "../types/meta.type";
import { PointTransaction } from "../entities/point-transaction.entity";
import { PointBalance } from "../entities/point-balances.entity";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../configs/typeorm.config";
import { logger } from "utils/logger";
import { AppError } from "types/error.types";

interface CreatePointTransactionDto {
  senderUserId?: string;
  receiverUserId: string;
  transactionDate?: Date;
  points: number;
  reasonCode: PointReasonCode;
  reasonDetail?: string;
}

interface TransactionSummary {
  totalPoints: number;
  transactionCount: number;
  transactions: PointTransaction[];
}

interface DepartmentTransactionSummary {
  deptCode: string;
  deptName: string;
  totalPoints: number;
  transactionCount: number;
  transactions: PointTransaction[];
  userSummaries: {
    userId: string;
    userName: string;
    totalPoints: number;
    transactionCount: number;
  }[];
}

export class PointTransactionService {
  private pointTransactionRepository: Repository<PointTransaction>;
  private pointBalanceRepository: Repository<PointBalance>;
  private userRepository: Repository<User>;
  private dataSource: DataSource;

  constructor() {
    this.pointTransactionRepository =
      AppDataSource.getRepository(PointTransaction);
    this.pointBalanceRepository = AppDataSource.getRepository(PointBalance);
    this.userRepository = AppDataSource.getRepository(User);
    this.dataSource = AppDataSource;
  }

  // pointTransaction 생성
  async create(data: CreatePointTransactionDto): Promise<PointTransaction> {
    try {
      // senderUserId 입력 체크
      if (data.senderUserId) {
        const senderUser = await this.userRepository.findOne({
          where: { userId: data.senderUserId },
        });

        if (!senderUser) {
          throw new AppError("Sender not found", 404);
        }
      }

      // receiverUserId 입력 체크
      if (!data.receiverUserId) {
        throw new AppError("userId is required", 400);
      } else {
        const ReceiverUser = await this.userRepository.findOne({
          where: { userId: data.receiverUserId },
        });

        if (!ReceiverUser) {
          throw new AppError("Receiver not found", 404);
        }
      }

      // points 입력 체크
      if (!data.points) {
        throw new AppError("points is required", 400);
      }

      // reasonCode 입력 체크
      if (!data.reasonCode) {
        throw new AppError("reasonCode is required", 400);
      }

      // Data 입력
      const pointTransaction = this.pointTransactionRepository.create({
        ...data,
        senderUserId: data.senderUserId || "ADMIN",
        transactionDate: data.transactionDate || new Date(),
      });
      return await this.pointTransactionRepository.save(pointTransaction);
    } catch (error) {
      logger.error("Error creating pointTransaction:", error);
      throw new AppError("Failed to create pointTransaction", 500);
    }
  }

  // point-transaction 목록 조회
  async findAll(): Promise<PointTransaction[]> {
    return await this.pointTransactionRepository.find();
  }

  // point-transaction 단건 조회 (id)
  async findById(id: string): Promise<PointTransaction> {
    const pointTransaction = await this.pointTransactionRepository.findOne({
      where: { id },
    });

    if (!pointTransaction) {
      throw new AppError("PointBalance not found", 404);
    }
    return pointTransaction;
  }

  // Transaction 목록 조회 (receiverUserId, startDate, endDate)
  async findByReceiverAndPeriod(
    receiverUserId: string,
    startDate: Date,
    endDate?: Date
  ): Promise<TransactionSummary> {
    try {
      // endDate 미입력시
      if (!endDate) {
        endDate = new Date();
      }

      logger.info(
        `Fetching transactions for receiver: ${receiverUserId}, period: ${startDate.toISOString()} - ${endDate.toISOString()}`
      );

      // receiverUserId 체크
      const user = await this.userRepository.findOne({
        where: { userId: receiverUserId },
      });

      if (!user) {
        throw new AppError("Receiver user not found", 404);
      }

      // Transaction 목록 조회
      const transactions = await this.pointTransactionRepository.find({
        where: {
          receiverUserId,
          transactionDate: Between(startDate, endDate),
        },
        order: {
          transactionDate: "DESC",
        },
      });

      // Point 합계 계산
      const totalPoints = transactions.reduce((sum, tx) => sum + tx.points, 0);

      return {
        totalPoints,
        transactionCount: transactions.length,
        transactions,
      };
    } catch (error) {
      logger.error(
        "Error fetching transactions by receiver and period:",
        error
      );
      throw error instanceof AppError
        ? error
        : new AppError("Failed to fetch transactions", 500);
    }
  }

  // Transaction 목록 조회 (deptCode, startDate, endDate)
  async findByDepartmentAndPeriod(
    deptCode: string,
    startDate: Date,
    endDate: Date
  ): Promise<DepartmentTransactionSummary> {
    try {
      logger.info(
        `Fetching transactions for department: ${deptCode}, period: ${startDate.toISOString()} - ${endDate.toISOString()}`
      );

      // user 조회 (deptCode)
      const users = await this.userRepository.find({
        where: { deptCode },
      });

      if (users.length === 0) {
        throw new AppError("No users found in the department", 404);
      }

      const userIds = users.map((user) => user.userId);

      // transaction 목록 조회
      const transactions = await this.pointTransactionRepository.find({
        where: {
          receiverUserId: In(userIds),
          transactionDate: Between(startDate, endDate),
        },
        order: {
          transactionDate: "DESC",
        },
      });

      // 사용자별 통계 계산
      const userSummaries = users.map((user) => {
        const userTransactions = transactions.filter(
          (tx) => tx.receiverUserId === user.userId
        );

        return {
          userId: user.userId,
          userName: user.userName,
          totalPoints: userTransactions.reduce((sum, tx) => sum + tx.points, 0),
          transactionCount: userTransactions.length,
        };
      });

      // 부서 전체 통계
      const totalPoints = transactions.reduce((sum, tx) => sum + tx.points, 0);

      return {
        deptCode,
        deptName: users[0]?.deptCode || "Unknown Department",
        totalPoints,
        transactionCount: transactions.length,
        transactions,
        userSummaries,
      };
    } catch (error) {
      logger.error(
        "Error fetching transactions by department and period:",
        error
      );
      throw error instanceof AppError
        ? error
        : new AppError("Failed to fetch transactions", 500);
    }
  }

  async getDetailedTransactionStats(
    deptCode: string,
    startDate: Date,
    endDate: Date
  ) {
    try {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 1. 부서 전체 통계
        const departmentStats = await this.findByDepartmentAndPeriod(
          deptCode,
          startDate,
          endDate
        );

        // 2. 일별 통계
        const dailyStats = await queryRunner.manager
          .createQueryBuilder(PointTransaction, "tx")
          .select([
            "DATE(tx.transactionDate) as date",
            "SUM(tx.points) as totalPoints",
            "COUNT(*) as transactionCount",
          ])
          .where("tx.receiverUserId IN (:...userIds)", {
            userIds: departmentStats.userSummaries.map((u) => u.userId),
          })
          .andWhere("tx.transactionDate BETWEEN :startDate AND :endDate", {
            startDate,
            endDate,
          })
          .groupBy("DATE(tx.transactionDate)")
          .orderBy("date", "ASC")
          .getRawMany();

        // 3. 사유별 통계
        const reasonStats = await queryRunner.manager
          .createQueryBuilder(PointTransaction, "tx")
          .select([
            "tx.reasonCode as reasonCode",
            "SUM(tx.points) as totalPoints",
            "COUNT(*) as transactionCount",
          ])
          .where("tx.receiverUserId IN (:...userIds)", {
            userIds: departmentStats.userSummaries.map((u) => u.userId),
          })
          .andWhere("tx.transactionDate BETWEEN :startDate AND :endDate", {
            startDate,
            endDate,
          })
          .groupBy("tx.reasonCode")
          .orderBy("totalPoints", "DESC")
          .getRawMany();

        await queryRunner.commitTransaction();

        return {
          departmentStats,
          dailyStats,
          reasonStats,
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      logger.error("Error getting detailed transaction stats:", error);
      throw error instanceof AppError
        ? error
        : new AppError("Failed to get transaction stats", 500);
    }
  }
}
