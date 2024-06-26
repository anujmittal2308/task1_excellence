const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const user = require("./routes/User");
const User = require("./db/User");
const connectDB = require("./db/config");

const port = 3000;

connectDB();
require("dotenv").config();
app.use("/user", user);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
