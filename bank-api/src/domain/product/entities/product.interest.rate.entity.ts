import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Rate } from "src/domain/common/rate.entity";
import { Product } from "./product.entity";

@Entity({ name: "product_interest_rate" })
@Index(["product"])
@Index(["startDate"])
export class ProductInterestRate extends Rate {
  @Column({ type: "text", nullable: true, comment: "설명" })
  description: string;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  product: Product;
}
