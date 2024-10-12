import { Column } from "typeorm";
import { CommonEntity } from "./common.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Rate extends CommonEntity {
  @ApiProperty({ description: "시작일자" })
  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "시작일자",
  })
  startDate: Date;

  @ApiProperty({ description: "종료일자" })
  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "종료일자",
  })
  endDate: Date;

  @ApiProperty({ description: "비율" })
  @Column({ type: "float", comment: "비율" })
  rate: number;

  @ApiProperty({ description: "사용여부" })
  @Column({ comment: "사용여부" })
  useYn: string;
}
