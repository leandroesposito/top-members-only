require("dotenv").config();
const userDB = require("../db/user");
const validator = require("./validator");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");

const validateUser = [
  validator.bodyText("first-name", 50),
  validator.bodyText("last-name", 50),
  validator.bodyText("username", 50),
  validator.bodyText("password"),
  validator.bodyText("confirm-password"),
  validator.bodyEqual("password", "confirm-password"),
  body("username").custom(async (value) => {
    const user = await userDB.getUserByUsername(value);
    if (user) {
      throw new Error(`Another account already has the username: ${value}`);
    }
    return true;
  }),
  body("is-member").custom((value, { req }) => {
    if (value && req.body["member-password"] !== process.env.MEMBER_PASSWORD) {
      throw new Error("Incorrect member password");
    }
    return true;
  }),
  body("is-admin").custom((value, { req }) => {
    if (value && req.body["admin-password"] !== process.env.ADMIN_PASSWORD) {
      throw new Error("Incorrect admin password");
    }
    return true;
  }),
];

function signUpGet(req, res) {
  res
    .status(200)
    .render("sign_up.ejs", { title: "Sign up", action: "sign-up" });
}

const signUpPost = [
  validateUser,
  validator.checkValidation,
  async function signUpPost(req, res) {
    const user = {
      first_name: req.body["first-name"],
      last_name: req.body["last-name"],
      username: req.body["username"],
      password: req.body["password"],
      is_member: req.body["is-member"] ?? false,
      is_admin: req.body["is-admin"] ?? false,
    };

    if (res.locals.errors) {
      req.flash("user", user);
      return res.redirect("/sign-up");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const id = await userDB.insertUser(user);
    if (id) {
      req.flash("success", "User created successfuly");
      return res.redirect("/log-in");
    } else {
      req.flash("error", "Error creating user");
      req.flash("user", JSON.stringify(user));
      return res.redirect("/sign-up");
    }
  },
];

module.exports = {
  signUpGet,
  signUpPost,
};
