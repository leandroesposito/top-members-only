require("dotenv").config();
const userDB = require("../db/user");
const { validationResult } = require("express-validator");
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
  body("username").custom((value) => {
    const user = userDB.getUserByUsername(value);
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
  async function signUpPost(req, res) {
    const user = {
      first_name: req.body["first-name"],
      last_name: req.body["last-name"],
      username: req.body["username"],
      password: req.body["password"],
      is_member: req.body["is-member"] ?? false,
      is_admin: req.body["is-admin"] ?? false,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.locals.errors = errors.array();
      res.locals.user = user;
      return signUpGet(req, res);
    }

    user.password = await bcrypt.hash(user.password, 10);

    const id = await userDB.insertUser(user);
    if (id) {
      res.locals.sucess = res.locals.sucess || [];
      res.locals.sucess.push("User created sucessfuly");
    } else {
      res.locals.errors = res.locals.errors || [];
      res.locals.errors.push("Error creating user");
    }

    signUpGet(req, res);
  },
];

module.exports = {
  signUpGet,
  signUpPost,
};
