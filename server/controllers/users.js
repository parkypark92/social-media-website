const passport = require("passport");

module.exports.authenticate_user = (req, res, next) => {
  let responseObj = {
    statusCode: 0,
    errorMsg: "",
    data: {},
  };
  passport.authenticate("jwt", (err, user, info) => {
    if (err) {
      console.log("auth err");
      return next(err);
    }
    if (!user) {
      responseObj.data = info.message;
      responseObj.statusCode = 401;
      responseObj.errorMsg = "user is not authenticated!!!!";
      return res.json(responseObj);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports.get_user_info = async (req, res, next) => {
  res.send({ message: "Get users information from database" });
};
