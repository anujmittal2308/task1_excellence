const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirm_password: {
    type: String,
    required: true,
  },
});
UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
