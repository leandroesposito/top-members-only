const NotAuthorizedError = require("../errors/NotAuthorizedError");

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    throw new NotAuthorizedError("You must log in to continue.");
  }
  next();
}

function isMember(req, res, next) {
  if (!req.user || !req.user.is_member) {
    throw new NotAuthorizedError("You must log in as a member to continue.");
  }
  next();
}

function isNotMember(req, res, next) {
  if (!req.user.is_member) {
    return next();
  }

  res.locals.errors = [{ msg: "You already are a member" }];
  res.render("index.ejs");
}

function isAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    throw new NotAuthorizedError("You must log in as an admin to continue.");
  }
  next();
}

module.exports = {
  isAuthenticated,
  isMember,
  isNotMember,
  isAdmin,
};
