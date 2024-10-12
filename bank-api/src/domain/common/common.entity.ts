import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

export class CommonEntity extends BaseEntity {
  @ApiProperty({ description: "기본키" })
  @PrimaryGeneratedColumn({ comment: "PrimaryKey" })
  id: number;

  @ApiProperty({ description: "데이터 생성 일시" })
  @CreateDateColumn({ type: "timestamp without time zone" })
  createAt: Date;

  @ApiProperty({ description: "데이터 수정 일시" })
  @UpdateDateColumn({ type: "timestamp without time zone", nullable: true })
  updateAt: Date;

  @ApiProperty({ description: "데이터 삭제 일시" })
  @DeleteDateColumn({ type: "timestamp without time zone", nullable: true })
  deleteAt: Date;
}
