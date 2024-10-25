/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nsfiyn4pxdmz5ez")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_MxBztCs` ON `point_balances` (`user_id`)",
    "CREATE INDEX `idx_6v3lkqL` ON `point_balances` (\n  `point_code`,\n  `user_id`\n)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4scuog70",
    "name": "point_code",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nsfiyn4pxdmz5ez")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_MxBztCs` ON `point_balances` (`user_id`)"
  ]

  // remove
  collection.schema.removeField("4scuog70")

  return dao.saveCollection(collection)
})
