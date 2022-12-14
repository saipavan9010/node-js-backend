var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require("morgan");
var mongoose = require("mongoose");
var backup = require("./backup");
var cron = require("node-cron");
const logger = require("./app/logger");
const webPush = require("web-push");
const bodyParser = require("body-parser");

var cors = require("cors");
require("dotenv").config();
var expressValidator = require("express-validator");
const session = require("express-session");
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
// app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({ secret: "agarathisession", saveUninitialized: true, resave: true })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
app.use("/", adminRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  logger.error({ message: "Url not found" }, { res: res });
  res.status(404).json({ status: 404, message: "Url not found" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  logger.error({ message: err.message }, { res: err });
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
var db = mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  function (error) {
    if (error) console.log(error);

    console.log("DB connection successful");
  }
);

cron.schedule(
  "0 0 * * * ",
  () => {
    if (process.env.Process == "production") backup.dbAutoBackUp();
  },
  {
    scheduled: true,
    timezone: "Asia/Singapore",
  }
);

//

module.exports = app;
