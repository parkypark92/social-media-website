const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

/* GET users listing. */
router.get("/:userId", usersController.get_user_info);

module.exports = router;
