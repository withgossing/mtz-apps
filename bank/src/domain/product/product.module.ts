import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./entities/product.entity";
import { ProductInterestRate } from "./entities/product.interest.rate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductInterestRate]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
