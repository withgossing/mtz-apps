import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../configs/typeorm.config";
import { Department } from "../entities/department.entity";
import { AppError } from "../types/error.types";

export class DepartmentService {
  private departmentRepository: Repository<Department>;

  constructor() {
    this.departmentRepository = AppDataSource.getRepository(Department);
  }

  async create(data: Partial<Department>): Promise<Department> {
    // 상위 부서 존재 여부 확인
    if (data.parentDeptCode) {
      const parentDept = await this.departmentRepository.findOne({
        where: { deptCode: data.parentDeptCode },
      });

      if (!parentDept) {
        throw new AppError("Parent department not found", 404);
      }
    }

    const department = this.departmentRepository.create(data);
    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: ["parent", "children"],
    });
  }

  async findByDeptCode(deptCode: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { deptCode },
      // relations: ["parent", "children", "users"],
    });

    if (!department) {
      throw new AppError("Department not found", 404);
    }

    return department;
  }

  async getHierarchy(): Promise<Department[]> {
    return await this.departmentRepository.find({
      where: {
        parentDeptCode: IsNull(),
      },
      relations: ["children"],
      order: { deptCode: "ASC" },
    });
  }

  // 전체 계층 구조를 가져오는 개선된 메소드
  async getFullHierarchy(): Promise<Department[]> {
    const roots = await this.departmentRepository
      .createQueryBuilder("dept")
      .leftJoinAndSelect("dept.children", "children")
      .leftJoinAndSelect("children.children", "grandchildren")
      .where("dept.parentDeptCode IS NULL")
      .orderBy("dept.deptCode", "ASC")
      .addOrderBy("children.deptCode", "ASC")
      .addOrderBy("grandchildren.deptCode", "ASC")
      .getMany();

    return roots;
  }

  // 특정 부서의 전체 하위 부서를 가져오는 메소드
  async getDepartmentTree(deptCode: string): Promise<Department | null> {
    return await this.departmentRepository
      .createQueryBuilder("dept")
      .leftJoinAndSelect("dept.children", "children")
      .leftJoinAndSelect("children.children", "grandchildren")
      .where("dept.deptCode = :deptCode", { deptCode })
      .orderBy("children.deptCode", "ASC")
      .addOrderBy("grandchildren.deptCode", "ASC")
      .getOne();
  }

  // 부서 경로 가져오기 (특정 부서부터 최상위 부서까지)
  async getDepartmentPath(deptCode: string): Promise<Department[]> {
    const path: Department[] = [];
    let currentDept = await this.findByCode(deptCode);

    while (currentDept) {
      path.unshift(currentDept); // 배열 앞에 추가
      if (!currentDept.parentDeptCode) break;
      currentDept = await this.findByCode(currentDept.parentDeptCode);
    }

    return path;
  }

  // 하위 부서 코드 목록 가져오기 (재귀적)
  async getChildDeptCodes(deptCode: string): Promise<string[]> {
    const children = await this.departmentRepository.find({
      where: { parentDeptCode: deptCode },
    });

    let childCodes = children.map((child) => child.deptCode);

    for (const child of children) {
      const grandChildCodes = await this.getChildDeptCodes(child.deptCode);
      childCodes = [...childCodes, ...grandChildCodes];
    }

    return childCodes;
  }

  // 부서 이동 메소드
  async moveDepartment(
    deptCode: string,
    newParentDeptCode: string | null
  ): Promise<Department> {
    const department = await this.findByCode(deptCode);

    // 자기 자신을 상위 부서로 지정하는 것 방지
    if (deptCode === newParentDeptCode) {
      throw new AppError("Department cannot be its own parent", 400);
    }

    // 하위 부서를 상위 부서로 지정하는 것 방지
    if (newParentDeptCode) {
      const childCodes = await this.getChildDeptCodes(deptCode);
      if (childCodes.includes(newParentDeptCode)) {
        throw new AppError("Cannot set child department as parent", 400);
      }

      // 새로운 상위 부서 존재 여부 확인
      await this.findByCode(newParentDeptCode);
    }

    department.parentDeptCode = newParentDeptCode;
    return await this.departmentRepository.save(department);
  }

  // 부서 통계 정보
  async getDepartmentStats(deptCode: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    childDepartments: number;
    depth: number;
  }> {
    const department = await this.findByCode(deptCode);
    const childCodes = await this.getChildDeptCodes(deptCode);
    const path = await this.getDepartmentPath(deptCode);

    const [totalUsers, activeUsers] = await Promise.all([
      this.departmentRepository
        .createQueryBuilder("dept")
        .leftJoin("dept.users", "user")
        .where("dept.deptCode IN (:...deptCodes)", {
          deptCodes: [deptCode, ...childCodes],
        })
        .getCount(),

      this.departmentRepository
        .createQueryBuilder("dept")
        .leftJoin("dept.users", "user")
        .where("dept.deptCode IN (:...deptCodes)", {
          deptCodes: [deptCode, ...childCodes],
        })
        .andWhere("user.isActive = :isActive", { isActive: true })
        .getCount(),
    ]);

    return {
      totalUsers,
      activeUsers,
      childDepartments: childCodes.length,
      depth: path.length,
    };
  }

  async findByCode(deptCode: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { deptCode },
      // relations: ["parent", "children", "users"],
    });

    if (!department) {
      throw new AppError("Department not found", 404);
    }

    return department;
  }

  async update(
    deptCode: string,
    data: Partial<Department>
  ): Promise<Department> {
    const department = await this.findByCode(deptCode);

    if (
      data.parentDeptCode &&
      data.parentDeptCode !== department.parentDeptCode
    ) {
      // 순환 참조 방지
      if (data.parentDeptCode === deptCode) {
        throw new AppError("Department cannot be its own parent", 400);
      }

      // 새로운 상위 부서 존재 여부 확인
      const parentDept = await this.findByCode(data.parentDeptCode);

      // 하위 부서를 상위 부서로 지정하는 것 방지
      const childDepts = await this.getAllChildDepartments(deptCode);
      if (childDepts.some((child) => child.deptCode === data.parentDeptCode)) {
        throw new AppError("Cannot set child department as parent", 400);
      }
    }

    Object.assign(department, data);
    return await this.departmentRepository.save(department);
  }

  private async getAllChildDepartments(
    deptCode: string
  ): Promise<Department[]> {
    const children = await this.departmentRepository.find({
      where: { parentDeptCode: deptCode },
    });

    const allChildren = [...children];
    for (const child of children) {
      const grandChildren = await this.getAllChildDepartments(child.deptCode);
      allChildren.push(...grandChildren);
    }

    return allChildren;
  }
}
