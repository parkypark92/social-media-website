const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.process_signup = async (req, res, next) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.formData.username,
      email: req.body.formData.email,
      dateOfBirth: req.body.formData.dob,
    },
  });
  if (user) {
    res.json({ success: true, message: "User created", statusCode: 200, user });
  }
};
