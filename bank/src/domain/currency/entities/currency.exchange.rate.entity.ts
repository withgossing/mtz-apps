import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";

@Entity({ name: "currency_exchange_rate" })
@Index(["currency"])
@Index(["baseDate"])
@Index(["currency", "baseDate"])
export class Currency extends CommonEntity {
  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "기준일자",
  })
  baseDate: Date;

  @Column({ type: "float", comment: "환율" })
  rate: number;

  @Column({ comment: "사용여부" })
  useYn: string;

  @ManyToOne(() => Currency, { onDelete: "CASCADE" })
  currency: Currency;
}
