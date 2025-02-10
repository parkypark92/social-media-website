const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
require("./config/passport")(passport);

app.use(passport.initialize());

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/users", usersRouter);

module.exports = app;
