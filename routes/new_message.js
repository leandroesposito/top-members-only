const { Router } = require("express");
const newMessageController = require("../controllers/new_message");

const newMessageRouter = Router();

newMessageRouter.get("/", newMessageController.newMessageGet);
newMessageRouter.post("/", newMessageController.newMessagePost);

module.exports = newMessageRouter;
