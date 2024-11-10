import { Repository } from "typeorm";
import { AppDataSource } from "../configs/typeorm.config";
import { User } from "../entities/user.entity";
import { DepartmentService } from "./department.service";
import { AppError } from "../types/error.types";
import { UserType } from "../types/meta.type";
import { logger } from "../utils/logger";
import { Department } from "entities/department.entity";

interface CreateUserDto {
  userId: string;
  userName: string;
  deptCode: string;
  email: string;
  authLevel?: UserType;
  isActive?: boolean;
}

interface UpdateUserDto {
  userName?: string;
  deptCode?: string;
  email?: string;
  authLevel?: UserType;
  isActive?: boolean;
}

interface UserWithDepartment {
  user: User;
  department: Department;
}

export class UserService {
  private userRepository: Repository<User>;
  private departmentRepository: Repository<Department>;
  private departmentService: DepartmentService;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.departmentService = new DepartmentService();
  }

  async create(data: CreateUserDto): Promise<User> {
    // userId 입력 체크
    if (!data.userId) {
      throw new AppError("userId is required", 400);
    }

    // deptCode 입력 체크
    if (!data.deptCode) {
      throw new AppError("deptCode is required", 400);
    }

    // 부서 존재 여부 확인
    const department = await this.departmentRepository.findOne({
      where: { deptCode: data.deptCode },
    });

    // 부서정보가 없을 경우
    if (!department) {
      throw new AppError("Department not found", 404);
    }

    // unique column 중복 확인
    const existingUser = await this.userRepository.findOne({
      where: [{ userId: data.userId }, { email: data.email }],
    });

    // unique 중복값이 존재할 경우
    if (existingUser) {
      throw new AppError("User with this userId or email already exists", 409);
    }

    // Data 입력
    const user = this.userRepository.create({
      ...data,
      authLevel: data.authLevel || UserType.USER,
      isActive: data.isActive ?? true,
    });

    return await this.userRepository.save(user);
  }

  async update(userId: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findByUserId(userId);

    // 권한 변경 검증
    if (data.authLevel && user.authLevel === UserType.ADMIN) {
      throw new AppError("Cannot modify ADMIN user auth level", 403);
    }

    if (data.deptCode) {
      await this.departmentService.findByDeptCode(data.deptCode);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new AppError("Email already in use", 409);
      }
    }

    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // id 로 user entity 조회
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  // userId 로 user entity 조회
  async findByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  // userData 로 user entity 조회
  async findByUserUnique(userId: string, email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ userId: userId }, { email: email }],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async findByDepartment(deptCode: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { deptCode },
      relations: ["department"],
    });
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.findByUserId(userId);
    user.isActive = false;
    return await this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<User> {
    const user = await this.findByUserId(userId);
    user.isActive = true;
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ["department"],
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      relations: ["department"],
    });
  }

  async findByAuthLevel(authLevel: UserType): Promise<User[]> {
    return await this.userRepository.find({
      where: { authLevel },
    });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.findByUserId(userId);
    return user.authLevel === UserType.ADMIN;
  }

  async isManager(userId: string): Promise<boolean> {
    const user = await this.findByUserId(userId);
    return user.authLevel === UserType.MANAGER;
  }

  async changeUserDepartment(
    userId: string,
    newDeptCode: string
  ): Promise<User> {
    const user = await this.findByUserId(userId);
    await this.departmentService.findByDeptCode(newDeptCode);

    user.deptCode = newDeptCode;
    return await this.userRepository.save(user);
  }

  async changeUserAuthLevel(
    userId: string,
    newAuthLevel: UserType
  ): Promise<User> {
    const user = await this.findByUserId(userId);

    // 권한 변경 로직 검증
    if (user.authLevel === UserType.ADMIN && newAuthLevel !== UserType.ADMIN) {
      throw new AppError("Cannot demote ADMIN user", 403);
    }

    logger.info(
      `Changing user ${userId} auth level from ${user.authLevel} to ${newAuthLevel}`
    );

    user.authLevel = newAuthLevel;
    return await this.userRepository.save(user);
  }

  // 부서 내 권한별 사용자 수 조회
  async getDepartmentUserStats(
    deptCode: string
  ): Promise<Record<UserType, number>> {
    const users = await this.userRepository.find({
      where: { deptCode },
    });

    return users.reduce((acc, user) => {
      acc[user.authLevel] = (acc[user.authLevel] || 0) + 1;
      return acc;
    }, {} as Record<UserType, number>);
  }

  // 관리자 권한 이상의 모든 사용자 조회
  async findAllAdminUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ authLevel: UserType.ADMIN }, { authLevel: UserType.MANAGER }],
    });
  }
}
