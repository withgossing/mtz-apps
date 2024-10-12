import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Bank } from "./entities/bank.entity";

@Injectable()
export class BankRepository extends Repository<Bank> {}
