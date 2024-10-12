import { Column, Entity, Index } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";

@Entity({ name: "product" })
export class Product extends CommonEntity {
  @Column({ unique: true, comment: "상품코드" })
  productCode: string;

  @Column({ comment: "상품명" })
  productName: string;
}
