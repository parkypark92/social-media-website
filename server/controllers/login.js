const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

module.exports.process_login = asyncHandler(async (req, res, next) => {
  res.json({ status: 200, msg: "User verified", user: req.user });
});
