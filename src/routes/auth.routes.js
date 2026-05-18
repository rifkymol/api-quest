const express = require("express");

const router = express.Router();
const AUTH_TOKEN = "api-quest-token";

router.post("/token", (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "password") {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  return res.status(200).json({
    token: AUTH_TOKEN
  });
});

module.exports = router;
