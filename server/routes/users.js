const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");
const multer = require("multer");
const storage = multer.memoryStorage(); //memory storage is used so req.file.buffer can be accessed
const upload = multer({ storage: storage });

router.get(
  "/authenticate",
  controller.authenticate_user,
  function (req, res, next) {
    res.status(200).json(req.user);
  }
);
router.get("/profile-info", controller.get_profile_info);
router.get("/profile-posts", controller.get_profile_posts);
router.post("/create-post", controller.create_post);
router.get("/get-posts", controller.get_posts);
router.get("/get-single-post", controller.get_single_post);
router.get("/get-saved-posts", controller.get_saved_posts);
router.get("/get-post-comments", controller.get_post_comments);
router.get("/get-friends", controller.get_all_friends);
router.get("/get-requests-preview", controller.get_requests_preview);
router.get("/users-preview", controller.get_users_preview);
router.post("/friend-request", controller.send_friend_request);
router.post("/answer-request", controller.answer_friend_request);
router.post("/like-post", controller.like_post);
router.post("/unlike-post", controller.unlike_post);
router.post("/save-post", controller.save_post);
router.post("/unsave-post", controller.unsave_post);
router.post("/create-comment", controller.create_comment);
router.post(
  "/upload-profile-picture",
  upload.single("file"),
  controller.upload_profile_picture
);
router.get("/profile-picture", controller.get_profile_picture);
router.get("/conversations", controller.get_conversations);
router.post("/create-conversation", controller.create_conversation);
router.post(
  "/delete-empty-conversations",
  controller.delete_empty_conversations
);
router.post("/send-message", controller.send_message);
router.post("/message-seen", controller.update_message_seen);
router.post(
  "/message-notifications-seen",
  controller.update_message_notifications_seen
);
router.get("/get-notifications", controller.get_user_notifications);
router.post("/post-notification", controller.create_post_notification);
router.post(
  "/friend-request-notification",
  controller.create_friend_request_notification
);
router.post("/seen-notifications", controller.update_seen_notifications);

module.exports = router;
