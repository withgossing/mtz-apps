import { Column, Entity, Index } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";

@Entity({ name: "bank" })
@Index(["bankCode"])
export declare class Bank extends CommonEntity {
  @Column({ unique: true, comment: "은행코드" })
  bankCode: string;

  @Column({ comment: "은행명" })
  bankName: string;
}
