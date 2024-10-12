import { Column, Entity, Index } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "bank" })
@Index(["bankCode"])
export class Bank extends CommonEntity {
  @ApiProperty({ description: "은행코드" })
  @Column({ unique: true, comment: "은행코드" })
  bankCode: string;

  @ApiProperty({ description: "은행명" })
  @Column({ comment: "은행명" })
  bankName: string;

  @ApiProperty({ description: "설명" })
  @Column({ type: "text", nullable: true, comment: "설명" })
  description: string;
}
