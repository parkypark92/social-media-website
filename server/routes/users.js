const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/authenticate",
  controller.authenticate_user,
  function (req, res, next) {
    res.json(req.user);
  }
);
router.get("/profile-info", controller.get_profile_info);
router.post("/create-post", controller.create_post);
router.get("/get-posts", controller.get_posts);
router.get("/get-friends", controller.get_all_friends);
router.get("/get-requests-preview", controller.get_requests_preview);
router.get("/users-preview", controller.get_users_preview);
router.post("/friend-request", controller.send_friend_request);
router.post("/answer-request", controller.answer_friend_request);
router.post("/like-post", controller.like_post);
router.post("/unlike-post", controller.unlike_post);
router.post("/create-comment", controller.create_comment);
router.post(
  "/upload-profile-picture",
  upload.single("file"),
  controller.upload_profile_picture
);
router.get("/profile-picture", controller.get_profile_picture);

module.exports = router;
