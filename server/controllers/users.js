const passport = require("passport");
const prisma = require("../config/prisma");
const supabase = require("../config/supabase").supabase;
const { decode } = require("base64-arraybuffer");
const asyncHandler = require("express-async-handler");
const { Server } = require("socket.io");

module.exports.authenticate_user = (req, res, next) => {
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      console.log("auth err");
      return next(err);
    }
    if (!user) {
      return res.json({ msg: "user not authenticated", statusCode: 400 });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports.get_profile_info = asyncHandler(async (req, res, next) => {
  const profileInfo = await prisma.user.findUnique({
    where: {
      id: req.query.userId,
    },
  });
  res.status(200).json({ profileInfo });
});

module.exports.get_profile_posts = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const profilePosts = await prisma.post.findMany({
    where: {
      authorId: req.query.userId,
    },
    orderBy: {
      postedAt: "desc",
    },
    skip: Number(skip),
    take: Number(limit),
    include: {
      author: true,
      likes: true,
      saves: true,
      comments: {
        orderBy: {
          postedAt: "desc",
        },
        include: {
          author: true,
        },
        take: 1,
      },
    },
  });
  console.log(profilePosts);
  res.status(200).json({ profilePosts });
});

module.exports.create_post = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "Text field is required." });
  }

  const post = await prisma.post.create({
    data: {
      text: req.body.text,
      authorId: req.body.userId,
    },
    include: {
      author: true,
      likes: true,
      saves: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  res.status(201).json({ post });
});

module.exports.delete_post = asyncHandler(async (req, res, next) => {
  await prisma.post.delete({
    where: {
      id: req.body.postId,
    },
  });
  res.status(200).json({ msg: "Post deleted" });
});

module.exports.get_posts = asyncHandler(async (req, res) => {
  const ids = Array.isArray(req.query.ids) ? req.query.ids : [];
  if (ids.length === 0) {
    return res.json({ posts: [] });
  }
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: ids,
      },
    },
    orderBy: {
      postedAt: "desc",
    },
    skip: Number(skip),
    take: Number(limit),
    include: {
      author: true,
      likes: true,
      saves: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          postedAt: "desc",
        },
        take: 1,
      },
    },
  });

  res.status(200).json({ posts });
});

module.exports.get_single_post = asyncHandler(async (req, res, next) => {
  const post = await prisma.post.findUnique({
    where: {
      id: req.query.postId,
    },
    include: {
      author: true,
      likes: true,
      saves: true,
    },
  });
  res.status(200).json({ post });
});

module.exports.get_saved_posts = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const savedPosts = await prisma.post.findMany({
    where: {
      saves: {
        some: {
          id: req.query.userId,
        },
      },
    },
    orderBy: {
      postedAt: "desc",
    },
    skip: Number(skip),
    take: Number(limit),
    include: {
      author: true,
      likes: true,
      saves: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          postedAt: "desc",
        },
        take: 1,
      },
    },
  });
  res.status(200).json({ savedPosts });
});

module.exports.get_post_comments = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const comments = await prisma.comment.findMany({
    where: {
      postId: req.query.postId,
    },
    include: {
      author: true,
    },
    orderBy: {
      postedAt: "desc",
    },
    skip: Number(skip),
    take: Number(limit),
  });
  res.status(200).json({ comments });
});

module.exports.get_all_friends = asyncHandler(async (req, res, next) => {
  const friendsList = await prisma.friendship.findMany({
    where: {
      OR: [
        {
          senderId: req.query.id,
          status: "accepted",
        },
        {
          receiverId: req.query.id,
          status: "accepted",
        },
      ],
    },
    include: {
      sender: true,
      receiver: true,
    },
  });
  res.status(200).json({ friendsList });
});

module.exports.get_requests_preview = asyncHandler(async (req, res, next) => {
  const requests = await prisma.friendship.findMany({
    where: {
      receiverId: req.query.id,
      status: "pending",
    },
    include: {
      sender: true,
    },
    ...(req.query.limit ? { take: parseInt(req.query.limit) } : {}),
  });
  res.status(200).json({ requests });
});

module.exports.get_users_preview = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: {
      id: { not: req.query.id },
      NOT: {
        OR: [
          { sentRequests: { some: { receiverId: req.query.id } } },
          { receivedRequests: { some: { senderId: req.query.id } } },
        ],
      },
    },
    ...(req.query.limit ? { take: parseInt(req.query.limit) } : {}),
    include: {
      sentRequests: true,
      receivedRequests: true,
    },
  });

  res.json({ users });
});

module.exports.send_friend_request = asyncHandler(async (req, res, next) => {
  const existingRequest = await prisma.friendship.findFirst({
    where: {
      senderId: req.body.sentBy,
      receiverId: req.body.receivedBy,
    },
  });

  if (existingRequest) {
    return res.status(400).json({ msg: "Friend request already sent!" });
  }

  const friendRequest = await prisma.friendship.create({
    data: {
      senderId: req.body.sentBy,
      receiverId: req.body.receivedBy,
    },
    include: {
      receiver: true,
    },
  });

  res.status(200).json({ friendRequest });
});

module.exports.answer_friend_request = asyncHandler(async (req, res, next) => {
  const friendshipStatus = await prisma.friendship.updateManyAndReturn({
    where: {
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      status: "pending",
    },
    data: {
      status: req.body.status,
    },
  });
  res.status(200).json({ msg: "Request Answered!", friendshipStatus });
});

module.exports.like_post = asyncHandler(async (req, res, next) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: req.body.postId,
    },
    data: {
      likes: {
        connect: {
          id: req.body.userId,
        },
      },
    },
  });
  res.status(200).json({ updatedPost });
});

module.exports.unlike_post = asyncHandler(async (req, res, next) => {
  const updatedPost = await prisma.post.update({
    where: {
      id: req.body.postId,
    },
    data: {
      likes: {
        disconnect: {
          id: req.body.userId,
        },
      },
    },
  });
  res.status(200).json({ msg: "Post unliked!", updatedPost });
});

module.exports.save_post = asyncHandler(async (req, res, next) => {
  const savedPost = await prisma.post.update({
    where: {
      id: req.body.postId,
    },
    data: {
      saves: {
        connect: {
          id: req.body.userId,
        },
      },
    },
  });
  res.status(200).json({ msg: "Post saved", savedPost });
});

module.exports.unsave_post = asyncHandler(async (req, res, next) => {
  const unsavedPost = await prisma.post.update({
    where: {
      id: req.body.postId,
    },
    data: {
      saves: {
        disconnect: {
          id: req.body.userId,
        },
      },
    },
  });
  res.status(200).json({ msg: "Post unsaved", unsavedPost });
});

module.exports.create_comment = asyncHandler(async (req, res, next) => {
  const comment = await prisma.comment.create({
    data: {
      text: req.body.text,
      authorId: req.body.authorId,
      postId: req.body.postId,
    },
    include: {
      author: true,
    },
  });
  res.status(200).json({ msg: "Comment submitted!", comment });
});

module.exports.upload_profile_picture = asyncHandler(async (req, res, next) => {
  const image = req.file;
  const imageExt = image.originalname.split(".").pop();
  const imageName = `profile-${Date.now()}.${imageExt}`;
  const filePath = `${req.body.id}/${imageName}`;
  const fileBase64 = decode(image.buffer.toString("base64"));

  try {
    const { error: uploadError } = await supabase.storage
      .from("user-images")
      .upload(filePath, fileBase64);
    if (uploadError) throw uploadError;

    //delete old picture
    const { data: pictures, error: listError } = await supabase.storage
      .from("user-images")
      .list(req.body.id);
    if (listError) throw listError;

    const toDelete = pictures
      .filter((pic) => pic.name !== imageName)
      .map((pic) => req.body.id + "/" + pic.name);

    if (toDelete.length !== 0) {
      const { error: deleteError } = await supabase.storage
        .from("user-images")
        .remove(toDelete);
      if (deleteError) throw deleteError;
    }

    const { data } = await supabase.storage
      .from("user-images")
      .getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    await prisma.user.update({
      where: { id: req.body.id },
      data: { profileUrl: imageUrl },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Upload failed:", error.message);

    await supabase.storage.from("user-images").remove([filePath]);

    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports.get_profile_picture = asyncHandler(async (req, res, next) => {
  const data = await prisma.user.findUnique({
    where: {
      id: req.query.userId,
    },
    select: {
      profileUrl: true,
    },
  });
  const imageUrl = data.profileUrl;
  res.status(200).json({ imageUrl });
});

module.exports.get_conversations = asyncHandler(async (req, res, next) => {
  const chats = await prisma.conversation.findMany({
    where: {
      OR: [{ userAId: req.query.id }, { userBId: req.query.id }],
    },
    include: {
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
      userA: true,
      userB: true,
    },
    orderBy: {
      lastMessageAt: "desc",
    },
  });
  res.status(200).json({ chats });
});

module.exports.create_conversation = asyncHandler(async (req, res, next) => {
  const [userAId, userBId] = [req.body.userId, req.body.friendId];
  const conversation = await prisma.conversation.create({
    data: {
      userAId,
      userBId,
    },
    include: {
      messages: true,
      userA: true,
      userB: true,
    },
  });
  res.status(200).json({ conversation });
});

module.exports.delete_empty_conversations = asyncHandler(
  async (req, res, next) => {
    await prisma.conversation.deleteMany({
      where: {
        id: {
          in: req.body.chatsToDelete,
        },
      },
    });
    res.status(200).json({ msg: "Chats deleted" });
  }
);

module.exports.send_message = asyncHandler(async (req, res, next) => {
  try {
    const message = await prisma.message.create({
      data: {
        content: req.body.message,
        senderId: req.body.senderId,
        conversationId: req.body.conversationId,
      },
      include: {
        sender: true,
      },
    });

    if (message) {
      const conversation = await prisma.conversation.update({
        where: {
          id: req.body.conversationId,
        },
        data: {
          lastMessageAt: message.createdAt,
          lastMessageSenderId: req.body.senderId,
          lastMessageSeen: false,
          newMessageNotificationSeen: false,
        },
      });
      res.status(200).json({ msg: "Message sent", message, conversation });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports.update_message_seen = asyncHandler(async (req, res, next) => {
  const updatedChat = await prisma.conversation.update({
    where: {
      id: req.body.currentChat.id,
    },
    data: {
      lastMessageSeen: true,
    },
    include: {
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
      userA: true,
      userB: true,
    },
  });
  res.status(200).json({ updatedChat });
});

module.exports.update_message_notifications_seen = asyncHandler(
  async (req, res, next) => {
    const updatedConversations = await prisma.conversation.updateMany({
      where: {
        AND: [
          {
            OR: [{ userAId: req.query.userId }, { userBId: req.query.userId }],
          },
          {
            lastMessageSenderId: {
              not: req.query.userId,
            },
          },
        ],
      },
      data: {
        newMessageNotificationSeen: true,
      },
    });
    res.status(200).json({ updatedConversations });
  }
);

module.exports.get_user_notifications = asyncHandler(async (req, res, next) => {
  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: req.query.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  res.status(200).json({ notifications });
});

module.exports.create_post_notification = asyncHandler(
  async (req, res, next) => {
    const notification = await prisma.notification.create({
      data: {
        type: req.body.type,
        message: req.body.message,
        recipientId: req.body.recipientId,
        senderId: req.body.senderId,
        postId: req.body.postId,
      },
    });
    res.status(200).json({ notification });
  }
);

module.exports.create_friend_request_notification = asyncHandler(
  async (req, res, next) => {
    const notification = await prisma.notification.create({
      data: {
        type: req.body.type,
        message: req.body.message,
        recipientId: req.body.recipientId,
        senderId: req.body.senderId,
      },
    });
    res.status(200).json({ notification });
  }
);

module.exports.update_seen_notifications = asyncHandler(
  async (req, res, next) => {
    console.log("here");
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: req.query.userId,
        seen: false,
      },
      data: {
        seen: true,
      },
    });
    console.log(updatedNotifications);
    res.status(200).json({ updatedNotifications });
  }
);
