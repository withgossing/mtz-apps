/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "nsfiyn4pxdmz5ez",
    "created": "2024-10-20 12:04:27.744Z",
    "updated": "2024-10-20 12:04:27.744Z",
    "name": "point_balances",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "kmy9nfot",
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
      },
      {
        "system": false,
        "id": "nnppg5r3",
        "name": "current_balace",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_MxBztCs` ON `point_balances` (`user_id`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("nsfiyn4pxdmz5ez");

  return dao.deleteCollection(collection);
})
