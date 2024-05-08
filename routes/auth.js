const express = require("express");
const router = express();
const authController = require("../controller/authController");

router.post("/", authController.handelLogin);

module.exports = router;
