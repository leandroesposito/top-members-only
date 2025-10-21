const validator = require("./validator");
const auth_validator = require("./auth_validator");
const messageDB = require("../db/message");

const newMessageGet = [
  auth_validator.isAuthenticated,
  function newMessageGet(req, res) {
    res.status(200).render("new_message.ejs", { title: "New message" });
  },
];

const newMessagePost = [
  auth_validator.isAuthenticated,
  validator.bodyText("title", 100),
  validator.bodyText("text"),
  async function newwMessagePost(req, res) {
    const message = {
      user_id: req.user.id,
      title: req.body.title,
      timestamp: new Date(),
      text: req.body.text,
    };

    if (res.locals.errors) {
      req.flash("message", message);
      return res.redirect("/new-message");
    }

    await messageDB.insertMessage(message);
    req.flash("success", "Message posted successfuly");
    res.redirect("/");
  },
];

module.exports = {
  newMessageGet,
  newMessagePost,
};
