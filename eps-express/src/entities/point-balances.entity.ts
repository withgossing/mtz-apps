import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PointType } from "../types/meta.type";

@Entity("EPSP001M01")
@Index(["userId", "pointType"], { unique: true }) // 복합 유니크 인덱스
export class PointBalance extends BaseEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    comment: "사용자 ID",
  })
  userId: string;

  @Column({
    type: "enum",
    enum: PointType,
    nullable: false,
    comment: "포인트 구분",
  })
  pointType: PointType;

  @Column({
    type: "integer",
    default: 0,
    comment: "현재 포인트 잔액",
  })
  balance: number;

  @Column({
    type: "timestamp",
    nullable: false,
    comment: "마지막 업데이트 일시",
  })
  lastUpdatedAt: Date;
}
