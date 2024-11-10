import { Entity, Column, Index, BeforeInsert, BeforeUpdate } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserType } from "../types/meta.type";
import * as bcrypt from "bcrypt";

@Entity("EPSU001M01")
@Index("idx_user_userId_unique", ["userId"], { unique: true })
@Index("idx_user_deptCode", ["deptCode"])
export class User extends BaseEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    comment: "사용자 ID",
  })
  userId: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "사용자명",
  })
  userName: string;

  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
    comment: "비밀번호",
  })
  password: string;

  @Column({
    type: "enum",
    enum: UserType,
    default: UserType.USER,
    comment: "권한 레벨",
  })
  authLevel: UserType;

  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    comment: "부서코드",
  })
  deptCode: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    unique: true,
    comment: "이메일",
  })
  @Index()
  email: string;

  @Column({
    type: "boolean",
    default: true,
    comment: "활성화 여부",
  })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // 비밀번호가 변경된 경우에만 해시 처리
    if (this.password && this.password.length < 60) {
      // bcrypt 해시 길이는 60자
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // 비밀번호 검증 메서드
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
