import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";

@Injectable()
export class TransactionRepository extends Repository<Transaction> {}
