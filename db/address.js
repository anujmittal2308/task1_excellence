const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  adress: [
    {
      type: String,
      required: true,
    },
  ],
  city: {
    type: String,
    required: true,
  },
  pin_code: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("user_address", userSchema);
