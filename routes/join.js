const { Router } = require("express");
const joinController = require("../controllers/join");

const joinRouter = Router();

joinRouter.get("/", joinController.joinGet);
joinRouter.post("/", joinController.joinPost);

module.exports = joinRouter;
