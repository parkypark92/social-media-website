const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.get_all_users = async (req, res, next) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: req.query.id,
      },
    },
    take: 4,
  });
  res.json({ users });
};

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

module.exports.create_post = async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ error: "Text field is required." });
    }
    const post = await prisma.post.create({
      data: {
        text: req.body.text,
        authorId: req.body.userId,
      },
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);

    if (error.code === "P2002") {
      return res.status(409).json({ error: "Duplicate entry detected." });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.get_all_posts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        postedAt: "desc",
      },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};
