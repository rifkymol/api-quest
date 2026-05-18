const express = require("express");
const pingController = require("../controllers/ping.controller");

const router = express.Router();

router.get("/", pingController.getPing);

module.exports = router;
