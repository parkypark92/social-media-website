const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase").supabase;
const { decode } = require("base64-arraybuffer");
const asyncHandler = require("express-async-handler");

module.exports.authenticate_user = (req, res, next) => {
  let responseObj = {
    statusCode: 0,
    errorMsg: "",
    data: {},
  };
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      console.log("auth err");
      return next(err);
    }
    if (!user) {
      responseObj.data = info.message;
      responseObj.statusCode = 401;
      responseObj.errorMsg = "user is not authenticated!!!!";
      return res.json(responseObj);
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
    include: {
      posts: {
        orderBy: {
          postedAt: "desc",
        },
        include: {
          author: true,
          likes: true,
          comments: {
            orderBy: {
              postedAt: "desc",
            },
            include: {
              author: true,
            },
          },
        },
      },
    },
  });
  res.status(200).json({ profileInfo });
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
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  res.status(201).json({ message: "Post created successfully", post });
});

module.exports.get_posts = asyncHandler(async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: req.query.ids,
      },
    },
    orderBy: {
      postedAt: "desc",
    },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          postedAt: "desc",
        },
      },
    },
  });

  res.status(200).json({ posts });
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

  await prisma.friendship.create({
    data: {
      senderId: req.body.sentBy,
      receiverId: req.body.receivedBy,
    },
  });

  res.status(200).json({ msg: "Request sent!" });
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
  await prisma.post.update({
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
  res.status(200).json({ msg: "Post liked!" });
});

module.exports.unlike_post = asyncHandler(async (req, res, next) => {
  await prisma.post.update({
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
  res.status(200).json({ msg: "Post unliked!" });
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
  console.log(req.file);
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

    const { data } = supabase.storage
      .from("user-images")
      .getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: req.body.id },
        data: { profileUrl: imageUrl },
      }),
    ]);

    console.log("Profile picture updated:", result);

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
