const { Router } = require("express");
const deleteController = require("../controllers/delete");

const deleteRouter = Router();

deleteRouter.post("/:id", deleteController.deletePost);

module.exports = deleteRouter;
