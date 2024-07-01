var passport = require("passport");
var passportJWT = require("passport-jwt");
const Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const User = require("./User");

let params = {
  secretOrKey: process.env.jwtkeys,
  jwtFromRequrest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
console.log(
  "jjdsiofn======================================================================="
);
console.log(params);

// //module.exports = function () {

//     console.log("jaiuodfjiodfjjojj-------------------------------jhfkjn");

// //   passport.use(
// //     new JwtStrategy(params, function (jwt_payload, next) {
// //       console.log(jwt_payload);
// //       User.findOne({ email: jwt_payload.email }, function (err, emp) {
// //         if (err) {
// //           return next(err, false);
// //         }
// //         if (emp) {
// //           next(null, emp);
// //         } else {
// //           next(null, false);
// //         }
// //       });
// //     })
// //   );
// // };

module.exports = function () {
  var strategy = new Strategy(params, function (payload, done) {
    User.findById(payload.id, function (err, user) {
      if (err) {
        return done(new Error("UserNotFound"), null);
      } else if (payload.expire <= Date.now()) {
        return done(new Error("TokenExpired"), null);
      } else {
        return done(null, user);
      }
    });
  });
  console.log("jaiuodfjiodfjjojj-------------------------------jhfkjn");
  passport.use(strategy);

  return {
    initialize: function () {
      return passport.initialize();
    },
  };
};
