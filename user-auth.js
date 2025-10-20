const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const userDB = require("./db/user");

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await userDB.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Incorrect username or password" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect username or password" });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

const serializeUser = (user, done) => {
  done(null, user.id);
};

const deserializeUser = async (id, done) => {
  try {
    const user = await userDB.getSafeUserById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};

module.exports = {
  strategy,
  serializeUser,
  deserializeUser,
};
