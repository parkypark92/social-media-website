const { validationResult } = require("express-validator");

module.exports.sendErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array(), status: 400 });
  }
  next();
};
