import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "./base.entity";
import { PointReasonCode } from "../types/meta.type";

@Entity("EPSP001L01")
export class PointTransaction extends BaseEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    comment: "보낸 사용자 ID",
  })
  @Index()
  senderUserId: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    comment: "받은 사용자 ID",
  })
  @Index()
  receiverUserId: string;

  @Column({
    type: "date",
    nullable: false,
    comment: "포인트 부여 일자",
  })
  @Index()
  transactionDate: Date;

  @Column({
    type: "enum",
    enum: PointReasonCode,
    nullable: false,
    comment: "사유 구분 코드",
  })
  reasonCode: PointReasonCode;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true,
    comment: "사유 내용",
  })
  reasonDetail: string;

  @Column({
    type: "integer",
    nullable: false,
    comment: "포인트",
  })
  points: number;
}
