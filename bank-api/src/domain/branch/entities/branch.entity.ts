import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";
import { Bank } from "src/domain/bank/entities/bank.entity";

@Entity({ name: "branch" })
@Index(["branchCode"])
export class Branch extends CommonEntity {
  @Column({ unique: true, comment: "지점코드" })
  branchCode: string;

  @Column({ comment: "지점명" })
  branchName: string;

  @ManyToOne(() => Bank, { onDelete: "CASCADE" })
  bank: Bank;
}
