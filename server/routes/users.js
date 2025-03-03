const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.get("/users-preview", controller.get_users_preview);
router.get(
  "/authenticate",
  controller.authenticate_user,
  function (req, res, next) {
    res.json(req.user);
  }
);
router.post("/create-post", controller.create_post);
router.get("/get-posts", controller.get_all_posts);
router.post("/friend-request", controller.send_friend_request);

module.exports = router;
