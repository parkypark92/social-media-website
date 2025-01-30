const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

router.post("/", loginController.process_login);

module.exports = router;
