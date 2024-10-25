/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("dncgnc9wqv6n5iu")

  collection.indexes = [
    "CREATE INDEX `idx_m1RHs1m` ON `transafer_approvals` (`sender_id`)",
    "CREATE INDEX `idx_3uqRhk1` ON `transafer_approvals` (`receiver_id`)",
    "CREATE INDEX `idx_gZK3XK1` ON `transafer_approvals` (`approval_id`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5v39ywtu",
    "name": "approval_id",
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
  const collection = dao.findCollectionByNameOrId("dncgnc9wqv6n5iu")

  collection.indexes = [
    "CREATE INDEX `idx_m1RHs1m` ON `transafer_approvals` (`sender_id`)",
    "CREATE INDEX `idx_3uqRhk1` ON `transafer_approvals` (`receiver_id`)"
  ]

  // remove
  collection.schema.removeField("5v39ywtu")

  return dao.saveCollection(collection)
})
