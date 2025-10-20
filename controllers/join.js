const validator = require("./validator");
const auth_validator = require("./auth_validator");
const userDB = require("../db/user");
const { body } = require("express-validator");

function joinGet(req, res) {
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
  validator.checkValidation,
  async function joinPost(req, res) {
    if (res.locals.errors) {
      return res.redirect("/join");
    }

    await userDB.promoteToMember(req.user.id);
    req.flash("success", "Welcome new member");
    res.redirect("/");
  },
];

module.exports = {
  joinGet,
  joinPost,
};
