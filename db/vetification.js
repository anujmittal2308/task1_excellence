const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  ramdom_no: {
    type: String,
    required: true,
  },
  time_out: {
    type: Number,
    required: true,
  },
});
const mod = mongoose.model("user_verification", userSchema);
module.exports = mod;
