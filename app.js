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
app.use("/", (req, res) => {
  res.status(200).render("index.ejs");
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`App listening on port: ${process.env.PORT}`);
});
