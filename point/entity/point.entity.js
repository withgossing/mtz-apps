const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "point",
  tableName: "point_balances",
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
    point_code: {
      type: "varchar",
      length: 4,
      nullable: false,
      default: 0,
    },
    current_point: {
      type: "int",
      nullable: false,
      default: 0,
    },
    receive_point: {
      type: "int",
      nullable: false,
      default: 0,
    },
    send_point: {
      type: "int",
      nullable: false,
      default: 0,
    },
    score_point: {
      type: "int",
      nullable: false,
      default: 0,
    },
  },
});
