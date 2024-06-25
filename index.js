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

connectDB();
require("dotenv").config();
app.use("/user", user);

app.get("/", (req, res) => {
  digest = crypto.createHash("md5").update("example@gmail.com").digest("hex");
  Math.floor((parseInt(digest, 16) / 2 ** 128) * 100);
  console.log(digest);

  res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
