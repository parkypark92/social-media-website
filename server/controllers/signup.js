const prisma = require("../config/prisma");
const asyncHandler = require("express-async-handler");
const { generatePassword } = require("../utils/passwordUtils");

module.exports.process_signup = asyncHandler(async (req, res, next) => {
  console.log("processing");
  const errors = [];
  const name = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  const email = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (name) {
    errors.push({
      msg: "Username already in use, please choose another username",
    });
  }
  if (email) {
    errors.push({ msg: "Email already in use, please choose another email" });
  }
  if (errors.length) {
    return res.json({ errors: errors, status: 400 });
  }

  const hashAndSalt = generatePassword(req.body.password);
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      email: req.body.email,
      dateOfBirth: req.body.dob,
      salt: hashAndSalt.salt,
      hash: hashAndSalt.hash,
    },
  });
  if (user) {
    res.json({ success: true, message: "User created", status: 200 });
  }
});
