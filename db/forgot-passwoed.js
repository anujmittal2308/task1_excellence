const mongoose = require("mongodb");
const userSchema = new mongoose.Schema({
  user_name: {
    typeof: String,
    require: true,
  },
  email: {
    typeof: String,
    require: true,
  },
});
module.exports = mongoose.module("froget_password", userSchema);
