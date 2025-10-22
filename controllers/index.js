const messageDB = require("../db/message");

async function indexGet(req, res) {
  let messages = [];
  if (req.user && (req.user.is_admin || req.user.is_member)) {
    messages = await messageDB.getAllMessagesDetailed();
  } else {
    messages = await messageDB.getAllMessages();
  }

  res.status(200).render("index.ejs", { messages });
}

module.exports = {
  indexGet,
};
