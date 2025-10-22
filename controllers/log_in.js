const passport = require("passport");

function logInGet(req, res) {
  res.status(200).render("log_in.ejs", { title: "Log in" });
}

const logInPost = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  }),
];

module.exports = {
  logInGet,
  logInPost,
};
