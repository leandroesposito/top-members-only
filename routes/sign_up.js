const { Router } = require("express");
const signUpController = require("../controllers/sign_up");

const signUpRoute = Router();

signUpRoute.get("/", signUpController.signUpGet);
signUpRoute.post("/", signUpController.signUpPost);

module.exports = signUpRoute;
