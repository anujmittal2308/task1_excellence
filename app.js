const express = require("express");
// const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
//const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const moment = require("moment");
//const dotenv = require("dotenv");
const app = express();
const port = 3000;

app.use(express.json());
require("dotenv").config();

// Function to encrypt password with md5 (replace with a more secure hashing algorithm in production)
function md5(str) {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(str).digest("hex");
}

//step 1
// connection requrement 12=>first get url of database 13=> take a name of database 14=>import the basic data
const dbURL = process.env.MONGO_URI;
const dbname = process.env.Database_Name;
const dom_data = require("./data.json");

//step 2 connection
//now make a connection funtion with db
const dbConnection = async () => {
  const connection = new MongoClient(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // first make a connection object with MongoClient which take 3 parameter url , err, do

  await connection.connect(); // by using connect object connect with DB
  const db = connection.db(dbname); // now we connec connection with data base
  const userCollection = db.collection("Users"); // make 2 collection inside a data base and connct with db BECOUSE db use for connect with database and .connect use to connet with server
  const userProfileCollection = db.collection("UsersProfile"); // same for 2th one

  return { connection, userCollection, userProfileCollection }; // and now retern every object
};

//spet 3 insert a data
async function insertUserTodb(user) {
  const data = await dbConnection(); // take a connet with database
  //const usersCollection = await (await connecTodb()).usersCollection;
  const userCollection = {
    first_name: user.first_name,
    Last_name: user.Last_name,
    email: user.email,
    password: user.password,
  }; // according to requrement of qus if we need to put complete data then put user instant of usercollection in next line
  user.password = md5(user.password); // Encrypt password
  await data.userCollection.insertOne(userCollection); // insert one by one
  const userProfile = {
    user_id: user._id,
    dob: user.dob,

    Mobile_no: user.Mobile_no,
  };

  await data.userProfileCollection.insertOne(userProfile);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function getAge(date) {
  const today = moment();
  const birthDate = moment(date);
  const age = today.diff(birthDate, "years");
  return age;
}

app.post("/", async (req, res) => {
  const users = dom_data;
  // console.log(users, "ok na");
  if (!Array.isArray(users)) {
    res.status(400).send("Data present OK");
  }
  try {
    for (const user of users) {
      insertUserTodb(user);
    }
    res.status(201).send("Data successfull inserted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error in inserting users");
  }
});
app.get("/age", async (req, res) => {
  const users = dom_data;
  // console.log(req.params);
  // console.log(req.body);
  // console.log(req.query);
  var avg_age = 0;
  for (const user of users) {
    const age = getAge(user.dob);
    avg_age = avg_age + age;
    // console.log(age);
    // console.log(avg_age);
  }
  avg_age = avg_age / 5;
  //console.log(avg_age);
  res.status(200).json({ data: avg_age });
});

app.delete("/delete", (req, res) => {
  const users = dom_data;
  for (const user of users) {
    const age = getAge(user.dob);
    if (age >= 100) {
      console.log(user);
      res.status(500).send(user);
    }
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
