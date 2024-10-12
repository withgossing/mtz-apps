import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Account } from "./entities/account.entity";
import { AccountInterestRate } from "./entities/account.interest.rate.entity";

@Injectable()
export class AccountRepository extends Repository<Account> {}

@Injectable()
export class AccountInterestRateRepository extends Repository<AccountInterestRate> {}
