const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.get("/", controller.get_all_users);
router.get(
  "/authenticate",
  controller.authenticate_user,
  function (req, res, next) {
    res.json(req.user);
  }
);
router.post("/create-post", controller.create_post);
router.get("/get-posts", controller.get_all_posts);

module.exports = router;
