const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "user",
  tableName: "point_user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    createAt: {
      type: "timestamp",
      nullable: false,
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      nullable: false,
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    deletedAt: {
      type: "timestamp",
      nullable: true,
      deleteDate: true,
    },
    user_id: {
      type: "varchar",
      length: 32,
      nullable: false,
    },
    user_name: {
      type: "varchar",
      length: 64,
      nullable: true,
    },
    password: {
      type: "varchar",
      length: 64,
      nullable: false,
    },
    department_code: {
      type: "varchar",
      length: 4,
      nullable: false,
      default: "0000",
    },
    department_name: {
      type: "varchar",
      length: 128,
      nullable: true,
    },
    position_code: {
      type: "varchar",
      length: 4,
      nullable: false,
      default: "0000",
    },
    position_name: {
      type: "varchar",
      length: 64,
      nullable: true,
    },
  },
});
