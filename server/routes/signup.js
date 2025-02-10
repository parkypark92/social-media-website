const express = require("express");
const router = express.Router();
const controller = require("../controllers/signup");
const { sendErrors } = require("../utils/validation/sendErrors");
const { validateSignup } = require("../utils/validation/validateSignup");

router.post("/", validateSignup(), sendErrors, controller.process_signup);

module.exports = router;
