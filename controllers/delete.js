const validator = require("./validator");
const auth_validator = require("./auth_validator");
const messageDB = require("../db/message");
const { param } = require("express-validator");

const deletePost = [
  auth_validator.isAdmin,
  validator.paramInt("id"),
  param("id").custom(async (value, { req }) => {
    const message = await messageDB.getMessageById(value);
    if (!message) {
      throw new Error(`Message with id ${id} doesnt exist`);
    }

    req.locals = { message };
    return true;
  }),
  validator.checkValidation,
  async function deletePost(req, res) {
    if (res.locals.errors) {
      return res.redirect("/");
    }

    const message = req.locals.message;
    await messageDB.deleteMessage(message);
    req.flash("success", "Message deleted successfuly");
    res.redirect("/");
  },
];

module.exports = {
  deletePost,
};
