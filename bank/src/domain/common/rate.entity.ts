import { Column } from "typeorm";
import { CommonEntity } from "./common.entity";

export class Rate extends CommonEntity {
  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "시작일자",
  })
  startDate: Date;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "종료일자",
  })
  endDate: Date;

  @Column({ type: "float", comment: "비율" })
  rate: number;

  @Column({ comment: "사용여부" })
  useYn: string;
}
