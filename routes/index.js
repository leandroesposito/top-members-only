const { Router } = require("express");
const indexController = require("../controllers/index");

const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);

module.exports = indexRouter;
