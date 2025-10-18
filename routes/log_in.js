const { Router } = require("express");
const logInController = require("../controllers/log_in");

const logInRouter = Router();

logInRouter.get("/", logInController.logInGet);
logInRouter.post("/", logInController.logInPost);

module.exports = logInRouter;
