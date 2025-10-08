const { body } = require("express-validator");
const prisma = require("../../config/prisma");
const { verifyPassword } = require("../../utils/passwordUtils");

module.exports.validateLogin = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .custom(async (value, { req }) => {
        const user = await prisma.user.findUnique({
          where: {
            username: value,
          },
        });
        if (!user) {
          return Promise.reject("Invalid Username");
        } else {
          req.user = user;
          return true;
        }
      }),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .custom(async (value, { req }) => {
        if (req.user) {
          if (!verifyPassword(value, req.user.salt, req.user.hash)) {
            return Promise.reject("Invalid password");
          } else {
            return true;
          }
        }
      }),
  ];
};
