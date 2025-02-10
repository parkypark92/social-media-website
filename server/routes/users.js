const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.get(
  "/authenticate",
  controller.authenticate_user,
  function (req, res, next) {
    res.json(req.user);
  }
);
router.get("/:userId", controller.get_user_info);

module.exports = router;
