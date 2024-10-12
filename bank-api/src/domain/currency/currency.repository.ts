import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Currency } from "./entities/currency.entity";

@Injectable()
export class CurrencyRepository extends Repository<Currency> {}
