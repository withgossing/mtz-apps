import { Repository, DataSource, Between, In } from "typeorm";
import { AppDataSource } from "../configs/typeorm.config";
import { PointBalance } from "../entities/point-balances.entity";
import { PointTransaction } from "../entities/point-transaction.entity";
import { User } from "../entities/user.entity";
import { PointType, PointReasonCode } from "../types/meta.type";
import { AppError } from "../types/error.types";
import { Department } from "../entities/department.entity";
import { logger } from "../utils/logger";

interface CreatePointBalanceDto {
  userId: string;
  pointType?: PointType;
  balance?: number;
  lastUpdatedAt?: Date;
}

interface GivePointsDto {
  senderUserId: string;
  receiverUserId: string;
  points: number;
  reasonCode: PointReasonCode;
  reasonDetail?: string;
}

interface PointStatsDto {
  pointsGiven: number;
  pointsReceived: number;
  transactions: PointTransaction[];
}

interface DepartmentRanking {
  totalPoints: number;
  rank: number;
  percentile: number;
  totalUsers: number;
  departmentAverage: number;
}

interface TransactionWithUserInfo {
  transaction: PointTransaction;
  sender: {
    userName: string;
    deptName: string;
  };
  receiver: {
    userName: string;
    deptName: string;
  };
}

export class PointBalanceService {
  private pointBalanceRepository: Repository<PointBalance>;
  private pointTransactionRepository: Repository<PointTransaction>;
  private userRepository: Repository<User>;
  private departmentRepository: Repository<Department>;
  private dataSource: DataSource;

  constructor() {
    this.pointBalanceRepository = AppDataSource.getRepository(PointBalance);
    this.pointTransactionRepository =
      AppDataSource.getRepository(PointTransaction);
    this.userRepository = AppDataSource.getRepository(User);
    this.departmentRepository = AppDataSource.getRepository(Department);
    this.dataSource = AppDataSource;
  }

  // pointBalace 생성
  async create(data: CreatePointBalanceDto): Promise<PointBalance> {
    try {
      // userId 입력 체크
      if (!data.userId) {
        throw new AppError("userId is required", 400);
      } else {
        const user = await this.userRepository.findOne({
          where: { userId: data.userId },
        });

        if (!user) {
          throw new AppError("User not found", 404);
        }
      }

      // Data 입력
      const pointBalance = this.pointBalanceRepository.create({
        ...data,
        pointType: data.pointType || PointType.RECEIVED,
        balance: data.balance ?? 0,
        lastUpdatedAt: data.lastUpdatedAt || new Date(),
      });
      return await this.pointBalanceRepository.save(pointBalance);
    } catch (error) {
      logger.error("Error creating pointBalasce:", error);
      throw new AppError("Failed to create pointBalance", 500);
    }
  }

  // point-balance 목록 조회
  async findAll(): Promise<PointBalance[]> {
    return await this.pointBalanceRepository.find();
  }

  // point-balance 단건 조회 (id)
  async findById(id: string): Promise<PointBalance> {
    const pointBalance = await this.pointBalanceRepository.findOne({
      where: { id },
    });

    if (!pointBalance) {
      throw new AppError("PointBalance not found", 404);
    }
    return pointBalance;
  }

  // point-balance 단건 조회 (userId)
  async findByUserId(userId: string): Promise<PointBalance> {
    const pointBalance = await this.pointBalanceRepository.findOne({
      where: { userId },
    });

    if (!pointBalance) {
      throw new AppError("PointBalance not found", 404);
    }
    return pointBalance;
  }

  /*
   * ====================
   *
   *
   *
   * ====================
   */

  private async getUserWithDepartment(userId: string): Promise<{
    userName: string;
    deptName: string;
  }> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const department = await this.departmentRepository.findOne({
      where: { deptCode: user.deptCode },
    });
    if (!department) {
      throw new AppError("Department not found", 404);
    }

    return {
      userName: user.userName,
      deptName: department.deptName,
    };
  }

  async getTransactionWithUserInfo(
    transactionId: string
  ): Promise<TransactionWithUserInfo> {
    const transaction = await this.pointTransactionRepository.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    const [sender, receiver] = await Promise.all([
      this.getUserWithDepartment(transaction.senderUserId),
      this.getUserWithDepartment(transaction.receiverUserId),
    ]);

    return {
      transaction,
      sender,
      receiver,
    };
  }

  async getDepartmentTransactions(
    deptCode: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionWithUserInfo[]> {
    // 부서의 모든 사용자 조회
    const users = await this.userRepository.find({
      where: { deptCode },
    });
    const userIds = users.map((user) => user.userId);

    // 해당 사용자들의 거래 내역 조회
    const transactions = await this.pointTransactionRepository.find({
      where: [{ senderUserId: In(userIds) }, { receiverUserId: In(userIds) }],
      order: { transactionDate: "DESC" },
    });

    // 사용자 정보 포함하여 반환
    const results = await Promise.all(
      transactions.map(async (transaction) => ({
        transaction,
        sender: await this.getUserWithDepartment(transaction.senderUserId),
        receiver: await this.getUserWithDepartment(transaction.receiverUserId),
      }))
    );

    return results;
  }

  async getDepartmentPointStats(deptCode: string): Promise<{
    totalReceived: number;
    totalGiven: number;
    activeUsers: number;
  }> {
    const users = await this.userRepository.find({
      where: { deptCode, isActive: true },
    });
    const userIds = users.map((user) => user.userId);

    const transactions = await this.pointTransactionRepository.find({
      where: [{ senderUserId: In(userIds) }, { receiverUserId: In(userIds) }],
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
  }

  async initializeUserPoints(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.dataSource.transaction(async (manager) => {
      // 받은 포인트 초기화
      await manager.save(PointBalance, {
        userId,
        pointType: PointType.RECEIVED,
        balance: 0,
        lastUpdatedAt: new Date(),
      });

      // 줄 수 있는 포인트 초기화
      await manager.save(PointBalance, {
        userId,
        pointType: PointType.AVAILABLE,
        balance: 100, // 초기 지급 포인트
        lastUpdatedAt: new Date(),
      });
    });
  }

  async givePoints(data: GivePointsDto): Promise<PointTransaction> {
    const { senderUserId, receiverUserId, points, reasonCode, reasonDetail } =
      data;

    if (points <= 0) {
      throw new AppError("Points must be greater than 0", 400);
    }

    if (senderUserId === receiverUserId) {
      throw new AppError("Cannot give points to yourself", 400);
    }

    return await this.dataSource.transaction(async (manager) => {
      // 보내는 사람의 가용 포인트 확인
      const senderBalance = await manager.findOne(PointBalance, {
        where: {
          userId: senderUserId,
          pointType: PointType.AVAILABLE,
        },
      });

      if (!senderBalance || senderBalance.balance < points) {
        throw new AppError("Insufficient points", 400);
      }

      // 받는 사람의 받은 포인트 조회
      let receiverBalance = await manager.findOne(PointBalance, {
        where: {
          userId: receiverUserId,
          pointType: PointType.RECEIVED,
        },
      });

      // 포인트 거래 기록
      const transaction = await manager.save(PointTransaction, {
        senderUserId,
        receiverUserId,
        transactionDate: new Date(),
        reasonCode,
        reasonDetail,
        points,
      });

      // 잔액 업데이트
      senderBalance.balance -= points;
      senderBalance.lastUpdatedAt = new Date();
      await manager.save(senderBalance);

      if (receiverBalance) {
        receiverBalance.balance += points;
        receiverBalance.lastUpdatedAt = new Date();
        await manager.save(receiverBalance);
      } else {
        await manager.save(PointBalance, {
          userId: receiverUserId,
          pointType: PointType.RECEIVED,
          balance: points,
          lastUpdatedAt: new Date(),
        });
      }

      return transaction;
    });
  }

  // 1. 잔고 기준 받은 포인트 조회
  async getReceivedPointBalance(userId: string): Promise<{
    userId: string;
    balance: number;
    lastUpdatedAt: Date;
  }> {
    const balance = await this.pointBalanceRepository.findOne({
      where: {
        userId,
        pointType: PointType.RECEIVED,
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
  }

  async getUserPointBalances(userId: string): Promise<PointBalance[]> {
    return await this.pointBalanceRepository.find({
      where: { userId },
    });
  }

  // 2. 거래내역 기준 받은 포인트 합계 조회
  async getReceivedPointsByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalPoints: number;
    transactions: PointTransaction[];
  }> {
    const transactions = await this.pointTransactionRepository
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
  }

  // 3. 부서 내 포인트 순위 조회
  async getDepartmentPointRanking(userId: string): Promise<DepartmentRanking> {
    // 사용자의 부서 정보 조회
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // 부서 내 모든 사용자의 포인트 합계 조회
    const departmentUsers = await this.userRepository.find({
      where: { deptCode: user.deptCode },
    });

    // 각 사용자별 포인트 합계 계산
    const userPoints = await Promise.all(
      departmentUsers.map(async (user) => {
        const points = await this.pointTransactionRepository
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
      })
    );
    // 포인트 기준 내림차순 정렬
    userPoints.sort((a, b) => b.points - a.points);

    // 현재 사용자의 순위 및 통계 계산
    const totalUsers = userPoints.length;
    const userRank = userPoints.findIndex((p) => p.userId === userId) + 1;
    const totalPoints =
      userPoints.find((p) => p.userId === userId)?.points || 0;
    const departmentTotal = userPoints.reduce((sum, p) => sum + p.points, 0);
    const departmentAverage = departmentTotal / totalUsers;
    const percentile = ((totalUsers - userRank) / totalUsers) * 100;

    return {
      totalPoints,
      rank: userRank,
      percentile: Math.round(percentile * 100) / 100, // 소수점 2자리까지
      totalUsers,
      departmentAverage: Math.round(departmentAverage * 100) / 100,
    };
  }

  // 4. 부서별 포인트 통계 조회 (추가 유틸리티 메서드)
  async getDepartmentPointStatsRank(deptCode: string): Promise<{
    totalPoints: number;
    averagePoints: number;
    topReceivers: Array<{ userId: string; points: number }>;
  }> {
    const users = await this.userRepository.find({
      where: { deptCode },
    });

    const userPoints = await Promise.all(
      users.map(async (user) => {
        const points = await this.pointTransactionRepository
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
      })
    );

    const totalPoints = userPoints.reduce((sum, p) => sum + p.points, 0);
    const averagePoints = totalPoints / users.length;

    // 상위 수신자 정렬
    const topReceivers = [...userPoints]
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    return {
      totalPoints,
      averagePoints: Math.round(averagePoints * 100) / 100,
      topReceivers,
    };
  }

  async getPointTransactionHistory(
    userId: string
  ): Promise<PointTransaction[]> {
    return await this.pointTransactionRepository.find({
      where: [{ senderUserId: userId }, { receiverUserId: userId }],
      relations: ["senderUser", "receiverUser"],
      order: {
        transactionDate: "DESC",
      },
    });
  }

  async getMonthlyPointStats(
    userId: string,
    year: number,
    month: number
  ): Promise<{
    pointsGiven: number;
    pointsReceived: number;
    transactions: PointTransaction[];
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.pointTransactionRepository.find({
      where: [
        { senderUserId: userId, transactionDate: Between(startDate, endDate) },
        {
          receiverUserId: userId,
          transactionDate: Between(startDate, endDate),
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
  }

  async getPointStatsByPeriod(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    pointsGiven: number;
    pointsReceived: number;
    transactions: PointTransaction[];
  }> {
    const transactions = await this.pointTransactionRepository.find({
      where: [
        { senderUserId: userId, transactionDate: Between(startDate, endDate) },
        {
          receiverUserId: userId,
          transactionDate: Between(startDate, endDate),
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
  }

  // 포인트 잔액 업데이트 로그 조회
  async getBalanceUpdateHistory(userId: string): Promise<PointBalance[]> {
    return await this.pointBalanceRepository.find({
      where: { userId },
      order: { lastUpdatedAt: "DESC" },
    });
  }
}
