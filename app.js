const path = require("node:path");
const express = require("express");
require("dotenv").config();

const app = express();
const signUpRoute = require("./routes/sign_up");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/sign-up", signUpRoute);

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }

  console.log(`App listening on port: ${process.env.PORT}`);
});
