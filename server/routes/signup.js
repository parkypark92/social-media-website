const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signup");
const { sendErrors } = require("../utils/validation/sendErrors");
const { validateSignup } = require("../utils/validation/validateSignup");

router.post("/", validateSignup(), sendErrors, signupController.process_signup);

module.exports = router;
