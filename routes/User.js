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
    return res
      .status(201)
      .json({ message: "User registered successfully", result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error found", err });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body.user_name);
  console.log(req.body.password);
  // console.log(User.find());
  try {
    if (req.body.user_name && req.body.password) {
      const username = req.body.user_name;
      const user = await User.findOne({ user_name: username }); // in find we pass in key valu pair
      console.log(user);
      if (user) {
        res.status(201).json({ message: " successful", _id: user._id });
      } else {
        res.status(400).send({ result: "No User found" });
      }
    }
  } catch (error) {
    res.status(400).send({ result: "No User found", error });
  }
});

router.get("/get/:_id", async (req, res) => {
  const user_id = req.params._id;
  console.log(user_id);
  console.log(user_id);
  try {
    const user = await User.findById(user_id);
    console.log(user);
    if (user) {
      res.status(201).send({ message: "successful", _id: user._id });
    } else {
      res.status(400).send({ message: "not not found" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
