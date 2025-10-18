const passport = require("passport");

function logInGet(req, res) {
  const flashErrors =
    req.flash && typeof req.flash === "function" ? req.flash("error") : [];
  if (flashErrors.length > 0) {
    if (!res.locals.errors) {
      res.locals.errors = [];
    }
    for (const message of flashErrors) {
      res.locals.errors.push({ msg: message });
    }
  }

  res.status(200).render("log_in.ejs", { title: "Log-in" });
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
