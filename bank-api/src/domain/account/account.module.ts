import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { Account } from "./entities/account.entity";
import { AccountInterestRate } from "./entities/account.interest.rate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    TypeOrmModule.forFeature([AccountInterestRate]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
