import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: "key" })
  id: number;

  @CreateDateColumn({ type: "timestamp without time zone" })
  createAt: Date;

  @UpdateDateColumn({ type: "timestamp without time zone", nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: "timestamp without time zone", nullable: true })
  deleteAt: Date;
}
