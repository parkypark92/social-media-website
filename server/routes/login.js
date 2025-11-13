const express = require("express");
const router = express.Router();
const controller = require("../controllers/login");
const { sendErrors } = require("../utils/validation/sendErrors");
const { validateLogin } = require("../utils/validation/validateLogin");

router.post("/", validateLogin(), sendErrors, controller.process_login);
router.post("/update-first-login", controller.update_first_login);

module.exports = router;
