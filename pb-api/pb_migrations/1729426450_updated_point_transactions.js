/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5n89w2kwwbihh1f")

  collection.indexes = [
    "CREATE INDEX `idx_HGKmg6t` ON `point_transactions` (`sender_id`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cx9jywps",
    "name": "receiver_id",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ddrejkcc",
    "name": "sender_id",
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
  const collection = dao.findCollectionByNameOrId("5n89w2kwwbihh1f")

  collection.indexes = [
    "CREATE INDEX `idx_HGKmg6t` ON `point_transactions` (`user_id`)"
  ]

  // remove
  collection.schema.removeField("cx9jywps")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ddrejkcc",
    "name": "user_id",
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
})
