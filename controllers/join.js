const validator = require("./validator");
const auth_validator = require("./auth_validator");
const userDB = require("../db/user");
const { validationResult } = require("express-validator");

function joinGet(req, res) {
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

  res.status(200).render("join.ejs", { title: "Become a member" });
}

const joinPost = [
  auth_validator.isAuthenticated,
  auth_validator.isNotMember,
  validator.bodyText("member-password"),
  body("member-password").custom((value) => {
    if (value !== process.env.MEMBER_PASSWORD) {
      throw new Error("Incorrect member password");
    }
    return true;
  }),
  async function joinPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      return joinGet(req, res);
    }

    await userDB.promoteToMember(req.user.id);
    res.locals.success = [{ msg: "Welcome new member" }];
    res.status(200).render("index.ejs");
  },
];

module.exports = {
  joinGet,
  joinPost,
};
