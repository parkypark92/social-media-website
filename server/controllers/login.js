const { issueJWT } = require("../utils/jwtUtils");
const asyncHandler = require("express-async-handler");
const prisma = require("../config/prisma");

module.exports.process_login = (req, res, next) => {
  const tokenObject = issueJWT(req.user);
  res.json({
    success: true,
    token: tokenObject.token,
    expiresIn: tokenObject.expires,
    status: 200,
    user: req.user,
  });
};

module.exports.update_first_login = asyncHandler(async (req, res, next) => {
  await prisma.user.update({
    where: {
      id: req.body.userId,
    },
    data: {
      firstLogin: false,
    },
  });
  res.status(200).json({ msg: "Updated!" });
});
