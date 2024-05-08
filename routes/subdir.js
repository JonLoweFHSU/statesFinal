const express = require("express");
const router = express();
const path = require("path");

router.get("^/$|/sub(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "sub.html"));
});

router.get("/new-page.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "test.html"));
});

module.exports = router;
