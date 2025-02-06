const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyPassword } = require("../utils/passwordUtils");
const asyncHandler = require("express-async-handler");

module.exports.process_login = asyncHandler(async (req, res, next) => {
  const errors = [];
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) {
    errors.push({ msg: "Invalid Username" });
  }
  const verified = verifyPassword(req.body.password, user.salt, user.hash);
  if (!verified) {
    errors.push({ msg: "Invalid Password" });
  }
  if (errors.length) {
    return res.json({ errors: errors, status: 400 });
  }
  res.json({ status: 200, msg: "User verified", user });
});
