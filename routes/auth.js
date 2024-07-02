const user = require("../db/User");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
var localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "username" },
      async (user_name, password, done) => {
        console.log("first", user_name, password);
        await user.findOne({ username: user_name }, (err, data) => {
          if (err) throw err;
          // if (!data) {
          //   return done(null, false, { message: "User Doesn't Exist !" });
          // }
          bcryptjs.compare(password, data.password, (err, match) => {
            if (err) {
              return done(null, false);
            }
            // if (!match) {
            //   return done(null, false, { message: "Password Doesn't match !" });
            // }

            return done(null, data, { message: "okok" });
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    await user.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
