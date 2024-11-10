import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  BeforeSoftRemove,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({
    type: "timestamp",
    nullable: false,
    comment: "생성일시",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    nullable: false,
    comment: "수정일시",
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
    comment: "삭제일시",
  })
  deletedAt: Date;

  @Column({
    type: "varchar",
    length: 36,
    nullable: false,
    comment: "생성자 ID",
  })
  createdBy: string;

  @Column({
    type: "varchar",
    length: 36,
    nullable: true,
    comment: "수정자 ID",
  })
  updatedBy: string;

  @Column({
    type: "varchar",
    length: 36,
    nullable: true,
    comment: "삭제자 ID",
  })
  deletedBy: string;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.id) {
      this.id = uuidv4();
    }
    // 실제 인증된 사용자 ID를 가져오는 로직이 필요합니다.
    this.createdBy = "system"; // 예시용 기본값
  }

  @BeforeUpdate()
  protected beforeUpdate() {
    // 실제 인증된 사용자 ID를 가져오는 로직이 필요합니다.
    this.updatedBy = "system"; // 예시용 기본값
  }

  @BeforeSoftRemove()
  protected beforeSoftRemove() {
    // 실제 인증된 사용자 ID를 가져오는 로직이 필요합니다.
    this.deletedBy = "system"; // 예시용 기본값
  }
}
