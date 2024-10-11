import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";
import { Account } from "src/domain/account/entities/account.entity";

@Entity({ name: "transaction" })
@Index(["account"])
@Index(["transactionDate"])
@Index(["account", "transactionDate"])
export declare class Transaction extends CommonEntity {
  @Column({
    type: "timestamp without time zone",
    default: () => "CURRENT_TIMESTAMP",
    comment: "거래일자",
  })
  transactionDate: Date;

  @Column({ type: "float", comment: "거래금액" })
  transactionAmount: number;

  @Column({ comment: "취소여부" })
  cancleYn: string;

  @Column({ comment: "상대은행코드" })
  targetBankCode: string;

  @Column({ comment: "상대계좌번호" })
  targetAccountNumber: string;

  @ManyToOne(() => Account, { onDelete: "CASCADE" })
  account: Account;
}
