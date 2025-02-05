const { body } = require("express-validator");

module.exports.validateSignup = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),

    body("email").trim().isEmail().withMessage("Invalid email address"),

    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("passwordConfirm")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    body("dob").notEmpty().withMessage("Date of birth is required"),
  ];
};
