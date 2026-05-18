const express = require("express");
const protectedController = require("../controllers/protected.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, protectedController.getProtected);

module.exports = router;
