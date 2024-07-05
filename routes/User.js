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
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passport = require("passport");
//require("../db/passports");
const jwtkey = process.env.jwtkeys;
const localstrategy = require("passport-local").Strategy;
//const conf = require("../db/jwtsec");
const jwtsimple = require("jwt-simple");
require("../db/config");
const session = require("express-session");
const { nextTick } = require("process");
const { Strategy } = require("passport-local");
require("./auth")(passport);
router.use(express.json());
require("../routes/auth")(passport);
passport.use("password", Strategy);
const bcryptjs = require("bcryptjs");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");
const { error, Console } = require("console");
const nodemailer = require("nodemailer");
const { Storages } = require("../db/storage");

const upload = multer({ Storages });

// router.set("view engine", "ejs");
// router.set("views", path.join(__dirname, "../views"));

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  console.log(user);
  try {
    const result = user;
    console.log(result);

    if (result.password != result.confirm_password) {
      return res.status(400).send("password not matched");
    }

    // const randomNum = Math.floor(Math.random() * 10000000);
    // userID = user._id;

    // req.session.randomNumber = randomNum;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    result.password = secPass;

    const sec_con_Pass = await bcrypt.hash(req.body.confirm_password, salt);

    result.confirm_password = sec_con_Pass;
    console.log(result);
    console.log(
      "------------------------------------------------------------------- ----------------------------------"
    );
    const result1 = await result.save();
    console.log(result1);
    console.log(
      "------------------------------------------------------------------- ----------------------------------"
    );
    jwt.sign({ result1 }, jwtkey, { expiresIn: "1h" }, (err, token) => {
      // if (err) {
      //   res.send({ message: "jwt not work ", err });
      // }
      try {
        console.log(token, "token ----------------------------------");
      } catch (err) {
        res.send(err);
      }

      console.log(token);
      console.log(token, "token ----------------------------------");
      // mail
      // var transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "pearlie.walter74@ethereal.email",
      //     pass: "",
      //   },
      // });
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: "lavada79@ethereal.email",
          pass: "cAjJ4SkjjbmmHWkQeQ",
        },
      });

      var mailOptions = {
        from: "pearlie.walter74@ethereal.email",
        to: "anujmittal2308@gmail.com",
        subject: "user detail",
        text: "you are register suserfully ",
        html: "<b>Hello world?</b>",
      };
      console.log("Message sent: %s", info.messageId);

      transporter.sendMail(mailOptions, () => {
        if (error) {
          console.log(error);
        } else {
          console.log("email send:" + info.response);
        }
      });
      console.log(mailOptions);

      return res.status(201).json({
        message: "User registered successfully",
        result1,
        auth: token,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "error found", err });
  }
});

// router.post("/login", (req, res, next) => {
//   console.log(req);
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       return res.redirect("/login?info=" + info);
//     }

//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }

//       return res.redirect("/");
//     });
//   })(req, res, next);
// });

router.post(
  "/login",

  //passport.authenticate("local", { session: true }),

  async (req, res) => {
    console.log(req.body.user_name);
    console.log(req.body.password);

    try {
      //in find we pass in key valu pair
      if (req.body.user_name && req.body.password) {
        const username = req.body.user_name;
        const userpassword = req.body.password;
        const user = await User.findOne({ user_name: username });

        // console.log(User.find());
        if (user) {
          bcryptjs.compare(user.password, userpassword, (err, match) => {
            if (err) {
              return res
                .status(400)
                .send({ message: "invalade passwoed side ", err });
            }
          });

          // if (user.password != userpassword) {
          //           //   res.status(400).send({ message: "invalade passwoed" });
          //           // console.log(user);

          //           // digest = crypto
          //           //   .createHash("md5")
          //           //   .update("example@gmail.com")
          //           //   .digest("hex");
          //           // Math.floor((parseInt(digest, 16) / 2 ** 128) * 100);
          //           // console.log(digest);
          //           // const user_Id = user._id;
          //           // console.log(user_Id);

          //           // const data = { user_id: user_Id, ramdom_no: digest };
          //           // const verifiuser = await new user_verification(data);

          //           // console.log(data);
          //           //try {
          //           // const data = user_verification.create({
          //           //   user_id: user_Id,
          //           //   ramdom_no: digest,
          //           // });
          //           //const date_time = new Date();
          //           // let date = ("0" + date_time.getDate()).slice(-2);
          //           // let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
          //           // let year = date_time.getFullYear();
          //           // const hours = date_time.getHours();
          //           // const minutes = date_time.getMinutes();
          //           // const seconds = date_time.getSeconds();
          //           // let time_count = 0 + hours * 60;
          //           // time_count = time_count + minutes;
          //           // time_count = time_count + seconds / 60;
          //           // prints date & time in YYYY-MM-DD HH:MM:SS format
          //           // console.log(time_count);

          //           //   const data = new user_verification({
          //           //     user_id: user_Id,
          //           //     ramdom_no: digest,
          //           //     time_out: time_count,
          //           //   });
          //           //   const savedData = await data.save();
          //           //   //          const result = await user_verification.save(data);
          //           // } catch (err) {
          //           //   console.log(err);
          //           // }

          jwt.sign({ user }, jwtkey, { expiresIn: "1h" }, (err, token) => {
            if (err) {
              return res.send({ message: "jwt not work ", err });
            }
            console.log(
              "========================================================================================================="
            );
            console.log(user);

            return res.status(201).send({
              message: " successful",
              _id: user._id,
              auth: token,
              user,
            });
          });
        } else {
          return res.status(400).send({ result: "No User found" });
        }
      }
    } catch (error) {
      return res.status(400).send({ result: "err in suever", error });
    }
  }
);

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
  const user = new user_add(req.body);
  const result = await user.save();
  res.status(201).json({ message: "add save ", result });
});

router.get("/gets/:id", VerifyToken, async (req, res) => {
  const user_id = req.params._id;
  console.log(
    "---------------------------------------------------------------------------------------------------------------"
  );
  console.log(req.params.id);
  console.log(
    "---------------------------------------------------------------------------------------------------------------"
  );
  try {
    const userA = await User.findOne({ fist_set: user_id });
    const userB = await user_add.findOne({ fist_set: user_id });

    console.log(userA);
    console.log(userB);
    const mergedObject = Object.assign(userA, userB);
    console.log(mergedObject);
    res.status(202).json({ message: "user with it addreas", mergedObject });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/address", VerifyToken, async (req, res) => {
  const user_id = req.body.id;
  const k = req.query.index_no - 1;
  console.log(user_id);
  console.log(k);
  try {
    const user = await user_add.findById(user_id);
    const userAdds = user.adress;
    let deleteAdd = [];
    console.log(deleteAdd);
    let i = 0;
    for (let userAdd of userAdds) {
      if (i <= k) {
        deleteAdd.push(userAdd);
        console.log(userAdd);
      }
      i++;
    }
    console.log(deleteAdd);
    res.status(200).send(deleteAdd);
  } catch (err) {
    res.status(400).send({ err });
  }
});

// async function VerifyToken(req, res, next) {
//   let token = req.query.access_token;
//   try {
//     const user = await user_verification.findOne({ ramdom_no: token });
//     console.log(token);
//     console.log(req.query);

//     console.log(user);

//     if (user) {
//       let timeout = user.time_out;
//       const date_time = new Date();
//       const hours = date_time.getHours();

//       const minutes = date_time.getMinutes();

//       const seconds = date_time.getSeconds();

//       let time_count = 0 + hours * 60;

//       time_count = time_count + minutes;

//       time_count = time_count + seconds / 60;

//       if (time_count >= timeout + 60) {
//         try {
//           console.log(user.time_out);
//         } catch (err) {
//           console.log(err);
//         }
//         //res.status(201).send({ message: "token is valid" });
//         next();
//       } else {
//         res.status(400).send({ message: "token expiry1" });
//       }
//     } else {
//       res.status(400).send({ message: "token no valid  2" });
//     }
//   } catch (err) {
//     res.status(400).send({ message: "token no pass 3", err });
//   }
// }

// jwt

async function VerifyToken(req, res, next) {
  let token = req.headers["authorization"];
  //console.log(token);
  //console.log("nakjdnhfhkj");
  if (token) {
    token = token.split(" ")[1];
    //console.log(token);
    jwt.verify(token, jwtkey, async (err, valid) => {
      console.log("==========================================================");

      if (err) {
        res.status(401).send({ result: "please provide valid token" });
      } else {
        req.value = valid.user;
        console.log(valid.user);
        next();
      }
    });
  } else {
    res.status(403).send({ result: "please add tokenn with header" });
  }
  //console.warn(token);
}

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

//new JwtStrategy(options, verify);
// var opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("jwt");
// console.log(ExtractJwt.fromAuthHeaderAsBearerToken("jwt"));
// opts.secretOrKey = jwtkey;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findOne({ id: jwt_payload.sub }, function (err, user) {
//       if (err) {
//         console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa-----------------------");
//         return done(err, false);
//       }
//       if (user) {
//         console.log(
//           "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-----------------------"
//         );
//         return done(null, user);
//       } else {
//         console.log(
//           "cccccccccccccccccccccccccccccccccccc-----------------------"
//         );
//         return done(null, false);
//         // or you could create a new account
//       }
//     });
//   })
// );

// passport.use(
//   new LocalStrategy(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.verifyPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );

// var cookieExtractor = function (req) {
//   var token = null;
//   console.log(
//     "dddddddddddddddddddddddddddddddddddddd-----------------------"
//   );
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };
// // ...
// opts.jwtFromRequest = cookieExtractor;

router.post("/forgot-password", VerifyToken, async (req, res) => {
  // if (req.body.password != req.body.confirm_password)
  //   res.status(400).send("confirm password not same");
  const user_Id = req.body._id;
  console.log(user_Id);
  const user = await User.findById(user_Id);

  if (!user) {
    res.status(400).send("user no found");
  }

  digest = crypto.createHash("md5").update("example@gmail.com").digest("hex");
  Math.floor((parseInt(digest, 16) / 2 ** 128) * 100);
  console.log(digest);

  console.log(user_Id);

  const data = { user_id: user_Id, ramdom_no: digest };

  const verifiuser = await new user_verification(data);

  console.log(data);
  console.log(verifiuser);
  try {
    // const datas = user_verification.create({
    //   user_id: user_Id,
    //   ramdom_no: digest,
    // });
    const date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    const hours = date_time.getHours();
    const minutes = date_time.getMinutes();
    const seconds = date_time.getSeconds();
    let time_count = 0 + hours * 60;
    time_count = time_count + minutes;
    time_count = time_count + seconds / 60;

    console.log(time_count);

    const data = user_verification.create({
      user_id: user_Id,
      ramdom_no: digest,
      time_out: time_count,
    });
    console.log(
      "========================================================================================================"
    );
    //const savedData = await data.save();
    console.log(
      "========================================================================================================"
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "",
        pass: "",
      },
    });
    var mailOptions = {
      from: "",
      to: user.email,
      subject: "token for change password",
      text: digest,
    };

    transporter.sendMail(mailOptions, () => {
      if (error) {
        console.log(error);
      } else {
        console.log("email send:" + info.response);
      }
    });
    console.log(mailOptions);
    //const result = user_verification.save(data);
    res.status(200).send("okok");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// async function VerifyToken1(req, res, next) {
//   let token = req.headers["authorization"];
//   //console.log(token);
//   //console.log("nakjdnhfhkj");
//   if (token) {
//     token = token.split(" ")[1];
//     //console.log(token);
//     jwt.verify(token, jwtkey, async (err, valid) => {
//       if (err) {
//         res.status(401).send({ result: "please provide valid token" });
//       } else {
//         next();
//       }
//     });
//   } else {
//     res.status(403).send({ result: "please add tokenn with header" });
//   }
//   //console.warn(token);
// }

router.post("/forgots-password", async (req, res) => {
  const username = req.body.user_name;
  const useremail = req.body.email;
  const user = await User.findOne({ user_name: username });
  console.log(user);
  if (!user) {
    return res.status(400).send("providing valaid user name");
  } else {
    jwt.sign({ useremail }, jwtkey, { expiresIn: "15m" }, (err, token) => {
      if (err) {
        console.log(err);
        return res.send({ message: "jwt not work ", err });
      }
      console.log(
        "===================================================_/_/======================================================="
      );
      console.log(user);

      res.status(201).send({
        message: " successful",
        email: req.body.email,
        auth: token,
      });
    });
  }
});

router.put("/verify-reset-password/:_token", async (req, res) => {
  let token = req.params._token;
  console.log(token);
  if (token) {
    token = token.split(" ")[0];

    jwt.verify(token, jwtkey, async (err, valid) => {
      console.log(token);
      console.log("==========================================================");
      console.log(valid);
      if (err) {
        res.status(401).send({ result: "please provide valid token" });
      } else {
        const useremail = valid.useremail;
        console.log(useremail);

        if (req.body.password != req.body.confirm_password) {
          return res
            .status(400)
            .send(" Password and confirm password not matches");
        }
        console.log(
          "=========================================================="
        );
        const user = await User.findOne({ email: useremail });

        //const user = await User.findOne({ user_email: useremail });
        console.log(
          "=========================================================="
        );
        console.log(user);
        console.log(
          "==========================================================2222222222222222222222222222222222222"
        );
        const new_pass = req.body.password;
        console.log(new_pass);
        var myquery = { password: user.password };
        console.log(user.password);
        var newvalue = { $set: { password: new_pass } };

        const mainuser = await User.updateOne(
          myquery,
          newvalue,
          { upsert: true }
          // function (err, doc) {
          //   if (err) return res.send(500, { error: err });
          //   return res.send(doc, "Succesfully saved.");
          // }
        );
        // then(() => {
        //   console.log("new password set");
        //   res.status(200).send("new password", User.password);
        // })
        // catch((e) => {
        //   console.error(e.message);
        //   res.status(400).send("password not update ");
        // });
        console.log(mainuser);

        res.status(200).send("password update");
        // next();
      }
    });
  } else {
    res.status(400).send({ result: "please add tokenn with header" });
  }
});

router.patch("/verify-reset-password/:token", async (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.status(400).send(" Password and confirm password not matches");
  }
  const token = req.params.token;
  console.log(token);

  const user = await user_verification.findOne({
    ramdom_no: token,
  });
  console.log(user);
  if (!user) {
    console.log("invalade token or genrater again");
    res.status(400).send("invalad token genrater again");
  }
  try {
    const date_time = new Date();

    const hours = date_time.getHours();
    const minutes = date_time.getMinutes();
    const seconds = date_time.getSeconds();
    let time_count = 0 + hours * 60;
    time_count = time_count + minutes;
    time_count = time_count + seconds / 60;

    console.log(time_count);
    const time_out = user.time_out;
    console.log(time_out + 16);
    if (time_out + 55 <= time_count) {
      res.status(201).send("token is expiry due to more than 15 min try again");
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    const secPassword = secPass;
    const user_id = user.user_id;
    //console.log(User._id);
    // const mainuser = await User.findById(
    //   user_id,
    //   ({ new_password: User.password }, { $set: secPassword }, { new: true })
    // );
    console.log(secPassword);

    const mainuser = await User.findByIdAndUpdate(
      { _id: user_id },
      {
        $set: { passwod: secPassword },
      },
      { new: true }
    );
    console.log(
      mainuser,
      "==========================================================="
    );
    //console.log(mainuser);
    console.log("===========================================================");

    res.status(200).send({ message: "new password set ", secPassword });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error", err });
  }
});

router.post("/uplode-image", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Done");
});
const filePath = "C:/Users/anujmittal/Desktop/task1_excellence";
console.log(__dirname);
const fileuplode = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});

router.post(
  "/profile-image",
  VerifyToken,
  fileuplode.single("user_file"),
  (req, res) => {
    try {
      //console.log(Date.now());
      res.status(201).send("file uplode");
    } catch (err) {
      console.log(err);
      res.send(400).send(err);
    }
  }
);

module.exports = router;
