import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("EPSD001M01")
export class Department extends BaseEntity {
  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    comment: "부서코드",
  })
  @Index({ unique: true })
  deptCode: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "부서명",
  })
  deptName: string;

  @Column({
    type: "varchar",
    length: 20,
    nullable: true,
    comment: "상위부서코드",
  })
  parentDeptCode: string | null;

  @Column({
    type: "boolean",
    default: true,
    comment: "활성화 여부",
  })
  isActive: boolean;
}
