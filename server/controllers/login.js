const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const { issueJWT } = require("../utils/jwtUtils");

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
