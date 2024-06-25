const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../db/User");
const user_add = require("../db/address");
const User_Login = require("../db/User_login");
const user_verification = require("../db/vetification");
const mongoose = require("mongoose");
const crypto = require("crypto");
const hash = crypto.createHash("sha256");
const md5 = require("md5");

require("../db/config");
const session = require("express-session");
router.use(express.json());

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    const result = await user.save();
    console.log(result);

    if (result.password != result.confirm_password) {
      return res.status(400).send("password not matched");
    }

    // const randomNum = Math.floor(Math.random() * 10000000);
    // userID = user._id;

    // req.session.randomNumber = randomNum;
    // const salt = await bcrypt.genSalt(10);
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
  // console.log(req.body.user_name);
  // console.log(req.body.password);

  try {
    //in find we pass in key valu pair
    if (req.body.user_name && req.body.password) {
      const username = req.body.user_name;
      const user = await User.findOne({ user_name: username });
      // console.log(User.find());
      if (user) {
        console.log(user);

        digest = crypto
          .createHash("md5")
          .update("example@gmail.com")
          .digest("hex");
        Math.floor((parseInt(digest, 16) / 2 ** 128) * 100);
        console.log(digest);
        const user_Id = user._id;
        console.log(user_Id);

        // const data = { user_id: user_Id, ramdom_no: digest };
        // const verifiuser = await new user_verification(data);

        // console.log(data);
        try {
          // const data = user_verification.create({
          //   user_id: user_Id,
          //   ramdom_no: digest,
          // });
          const date_time = new Date();
          // let date = ("0" + date_time.getDate()).slice(-2);
          // let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
          // let year = date_time.getFullYear();
          const hours = date_time.getHours();
          const minutes = date_time.getMinutes();
          const seconds = date_time.getSeconds();
          let time_count = 0 + hours * 60;
          time_count = time_count + minutes;
          time_count = time_count + seconds / 60;
          // prints date & time in YYYY-MM-DD HH:MM:SS format
          console.log(time_count);

          const data = new user_verification({
            user_id: user_Id,
            ramdom_no: digest,
            time_out: time_count,
          });
          const savedData = await data.save();
          //          const result = await user_verification.save(data);
        } catch (err) {
          console.log(err);
        }

        res.status(201).json({ message: " successful", _id: user._id });
      } else {
        res.status(400).send({ result: "No User found" });
      }
    }
  } catch (error) {
    res.status(400).send({ result: "err in suever", error });
  }
});

router.get("/get/:_id", VerifyToken, async (req, res) => {
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
    res.status(400).send({ message: "not not found", err });
  }
});

router.delete("/delete/:_id", VerifyToken, async (req, res) => {
  const user_id = req.params;
  console.log(req.params);
  console.log({ user_id });
  try {
    const user = await User.findByIdAndDelete(user_id);
    console.log(user);
    if (user) {
      res.status(201).send({ message: "user successfull delete", user });
    } else {
      res.status(400).send({ message: "user not fund" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "invalad id", err });
  }
});

router.get("/list/:page", VerifyToken, async (req, res) => {
  page_no = req.params.page;
  const user = await User.find();
  let n = page_no - 1;
  n = n * 10;
  let k = page_no * 10;
  let queue = [];
  for (let i = n; i < k; i++) {
    queue.push(user[i]);
  }
  res.send(queue);
});

router.post("/address/:id", VerifyToken, async (req, res) => {
  const user = new User(req.body);
  const result = await user.save();
  res.status(201).json({ message: "add save ", result });
});

router.get("/gets/:id", VerifyToken, (req, res) => {
  const user_id = req.params;
  try {
    const user1 = User.findById(user_id);
    const user2 = user_add.findById(user_id);
    const user = user1 + user2;
    res.status(202).json({ message: "user with it addreas", user });
  } catch (err) {
    res.status(400).send(err);
  }
});

async function VerifyToken(req, res, next) {
  let token = req.query.access_token;
  try {
    const user = await user_verification.findOne({ ramdom_no: token });
    console.log(token);
    console.log(req.query);

    console.log(user);

    if (user) {
      let timeout = user.time_out;
      const date_time = new Date();
      const hours = date_time.getHours();

      const minutes = date_time.getMinutes();

      const seconds = date_time.getSeconds();

      let time_count = 0 + hours * 60;

      time_count = time_count + minutes;

      time_count = time_count + seconds / 60;

      if (time_count >= timeout + 60) {
        try {
          console.log(user.time_out);
        } catch (err) {
          console.log(err);
        }
        //res.status(201).send({ message: "token is valid" });
        next();
      } else {
        res.status(400).send({ message: "token expiry1" });
      }
    } else {
      res.status(400).send({ message: "token no valid  2" });
    }
  } catch (err) {
    res.status(400).send({ message: "token no pass 3", err });
  }
}
module.exports = router;
