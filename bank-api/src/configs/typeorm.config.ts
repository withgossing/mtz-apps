import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mtzapps",
  password: "mtzapps",
  database: "mtzapps",
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: true,
};
