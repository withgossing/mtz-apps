import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductInterestRate } from "./entities/product.interest.rate.entity";

@Injectable()
export class ProductRepository extends Repository<Product> {}

@Injectable()
export class ProductInterestRateRepository extends Repository<ProductInterestRate> {}
