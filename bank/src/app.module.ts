import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { typeOrmModuleOptions } from "./configs/typeorm.config";

import { BankModule } from "./domain/bank/bank.module";
import { AccountModule } from "./domain/account/account.module";
import { BranchModule } from "./domain/branch/branch.module";
import { CurrencyModule } from "./domain/currency/currency.module";
import { ProductModule } from "./domain/product/product.module";
import { TransactionModule } from "./domain/transaction/transaction.module";
import { UserModule } from "./domain/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AccountModule,
    BankModule,
    BranchModule,
    CurrencyModule,
    ProductModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
