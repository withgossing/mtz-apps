const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "code",
  tableName: "point_code",
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
    code_id: {
      type: "varchar",
      length: 32,
      nullable: false,
    },
    code_name: {
      type: "varchar",
      length: 64,
      nullable: false,
    },
    code_type_id: {
      type: "varchar",
      length: 4,
      nullable: false,
    },
    code_type_name: {
      type: "varchar",
      length: 64,
      nullable: false,
    },
  },
});
