const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "point_user",
  tableName: "point_user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    email: {
      type: "varchar",
      nullable: false,
    },
  },
});
