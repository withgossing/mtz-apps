import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";

@Entity({ name: "currency" })
@Index(["currencyCode"])
export class Currency extends CommonEntity {
  @Column({ unique: true, comment: "통화코드" })
  currencyCode: string;

  @Column({ comment: "통화명" })
  currencyName: string;
}
