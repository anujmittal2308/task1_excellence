const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../db/User");
const User_Login = require("../db/User_login");
const mongoose = require("mongoose");
require("../db/config");
router.use(express.json());

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    const result = await user.save();
    console.log(result);

    if (result.password != result.confirm_password) {
      return res.status(400).send("password not matched");
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    result.password = secPass;

    const sec_con_Pass = await bcrypt.hash(req.body.confirm_password, salt);

    result.confirm_password = sec_con_Pass;
    console.log(result);

    // if (error) {
    //   console.log(error);
    //   res.status(400).json({ error }, { message: "Server error" });
    // }

    return res
      .status(201)
      .json({ message: "User registered successfully", result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error found", err });
  }
});

// router.post("/login", (req, res) => {
//   const user = new User(req.params.u);
// });

module.exports = router;
