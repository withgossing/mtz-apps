import { Column, Entity, Index, ManyToOne } from "typeorm";
import { CommonEntity } from "src/domain/common/common.entity";

@Entity({ name: "user" })
@Index(["userId"])
export declare class User extends CommonEntity {
  @Column({ unique: true, comment: "사용자ID" })
  userId: string;

  @Column({ length: 64, comment: "사용자명" })
  userName: string;

  @Column({ length: 64, comment: "비밀번호" })
  password: string;

  @Column({ length: 32, comment: "이메일주소" })
  email: string;
}
