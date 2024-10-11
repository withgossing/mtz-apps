import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";
import { User } from "src/domain/user/entities/user.entity";
import { Branch } from "src/domain/branch/entities/branch.entity";
import { Product } from "src/domain/product/entities/product.entity";

@Entity({ name: "account" })
@Index(["accountNumber"])
@Index(["user"])
@Index(["branch"])
export class Account extends CommonEntity {
  @Column({ unique: true, comment: "계좌번호" })
  accountNumber: string;

  @Column({ comment: "계좌명" })
  accountName: string;

  @Column({ type: "text", nullable: true, comment: "설명" })
  description: string;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "가입일자",
  })
  joinDate: Date;

  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "만기일자",
  })
  expirationDate: Date;

  @Column({ comment: "상태" })
  status: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Branch, { onDelete: "CASCADE" })
  branch: Branch;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  product: Product;
}
