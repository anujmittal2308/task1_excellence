const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const User = require("./User");

module.exports = function (passport) {
  let params = {};

  (params.secretOrKey = process.env.jwtkeys),
    (params.jwtFromRequrest = ExtractJwt.fromAuthHeaderAsBearerToken()),
    console.log("jaiuodfjiodfjjojj-------------------------------jhfkjn");

  passport.use(
    new JwtStrategy(params, function (jwt_payload, next) {
      console.log(jwt_payload);
      User.findOne({ email: jwt_payload.email }, function (err, emp) {
        if (err) {
          return next(err, false);
        }
        if (emp) {
          next(null, emp);
        } else {
          next(null, false);
        }
      });
    })
  );
};
