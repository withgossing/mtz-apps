// src/data-source.ts
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "mtzpoint",
  password: "mtzpoint",
  database: "mtzpoint",
  synchronize: true,
  logging: false,
  entities: ["entity/**/*.js"],
  subscribers: [],
  migrations: [],
});

module.exports = { AppDataSource };
