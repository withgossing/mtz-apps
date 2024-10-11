import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Rate } from "src/domain/common/rate.entity";
import { Account } from "./account.entity";

@Entity({ name: "product_interest_rate" })
@Index(["product"])
@Index(["startDate"])
export declare class ProductInterestRate extends Rate {
  @Column({ type: "text", nullable: true, comment: "설명" })
  description: string;

  @ManyToOne(() => Account, { onDelete: "CASCADE" })
  account: Account;
}
