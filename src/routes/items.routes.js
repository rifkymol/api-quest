const express = require("express");
const itemsController = require("../controllers/items.controller");

const router = express.Router();

router.get("/", itemsController.getItems);
router.post("/", itemsController.createItem);
router.get("/:id", itemsController.getItemById);
router.put("/:id", itemsController.updateItem);
router.delete("/:id", itemsController.deleteItem);

module.exports = router;
