const path = require("node:path");
const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const { strategy, serializeUser, deserializeUser } = require("./user-auth");
const flash = require("connect-flash");
const pool = require("./db/pool");
const pgSession = require("connect-pg-simple")(session);

const app = express();
const signUpRoute = require("./routes/sign_up");
const logInRouter = require("./routes/log_in");
const joinRouter = require("./routes/join");
const newMessageRouter = require("./routes/new_message");
const indexRouter = require("./routes");
const deleteRouter = require("./routes/delete");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(flash());
app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(strategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next) => {
  // initialize if doesn't exist
  res.locals.success = res.locals.success || [];
  res.locals.error = res.locals.error || [];

  // extract session flash messages
  const success = req.flash("success");
  const error = req.flash("error");
  const user = req.flash("user");

  // write messages to response
  res.locals.success = res.locals.success.concat(success);
  res.locals.error = res.locals.error.concat(error);
  res.locals.user = user.length > 0 ? user[0] : null;

  next();
});

app.use("/sign-up", signUpRoute);
app.use("/log-in", logInRouter);
app.use("/log-out", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});
app.use("/join", joinRouter);
app.use("/new-message", newMessageRouter);
app.use("/delete", deleteRouter);
app.use("/", indexRouter);

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`App listening on port: ${process.env.PORT}`);
});
