/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ax5mjizrizu4get")

  collection.indexes = [
    "CREATE INDEX `idx_Mn8xnwo` ON `expiring_points` (`user_id`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ax5mjizrizu4get")

  collection.indexes = []

  return dao.saveCollection(collection)
})
