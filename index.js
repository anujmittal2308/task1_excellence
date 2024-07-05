const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const user = require("./routes/User");
const User = require("./db/User");
const connectDB = require("./db/config");
const crypto = require("crypto");
const hash = crypto.createHash("sha256");
const md5 = require("md5");
const port = 3000;
const passport = require("passport");
connectDB();
require("dotenv").config();
const session = require("express-session");
app.use("/user", user);
require("./routes/auth")(passport);
app.use(passport.initialize());
const path = require("path");
const ejs = require("ejs");

const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

app.use(expressSession);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
