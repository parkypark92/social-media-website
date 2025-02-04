const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.process_signup = async (req, res, next) => {
  const errors = [];
  const name = await prisma.user.findUnique({
    where: {
      username: req.body.formData.username,
    },
  });
  const email = await prisma.user.findUnique({
    where: {
      email: req.body.formData.email,
    },
  });
  if (name) {
    errors.push("Username already in use, please choose another username");
  }
  if (email) {
    errors.push("Email already in use, please choose another email");
  }
  if (req.body.formData.passwordConfirm !== req.body.formData.password) {
    errors.push("Password not correctly confirmed");
  }
  if (errors.length) {
    return res.json({ msgs: errors, status: 400 });
  }
  const user = await prisma.user.create({
    data: {
      username: req.body.formData.username,
      email: req.body.formData.email,
      dateOfBirth: req.body.formData.dob,
    },
  });
  if (user) {
    res.json({ success: true, message: "User created", status: 200 });
  }
};
