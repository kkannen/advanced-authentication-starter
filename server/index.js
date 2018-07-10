// dotenv allows us to declare environment variables in a .env file, \
// find out more here https://github.com/motdotla/dotenv
require("dotenv").config({path: '/Users/kristakannen/Documents/ACA/advanced-authentication-starter/.env'});
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const authenticationRoutes = require("./routes/AuthenticationRoutes");

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
const promise = mongoose.connect(process.env.mongodburi, {
  useMongoClient: true,
}).then(
  () => { 
    console.log('\x1b[36m%s\x1b[0m', "mongoose connected successfully");
   
    //startWebServer();
  },
  err => {
    console.log('\x1b[36m%s\x1b[0m', "mongoose did not connect",err);
   }
);


const app = express();

app.get("/publicinformation", function (req, res) {
  res.send("Anyone can see this");
});

app.use(bodyParser.json());
app.use(userRoutes);
app.use(sessionRoutes);
app.use(authenticationRoutes);

app.get("/canigetthis", function (req, res) {
  res.send("You got the data. You are authenticated");
});
app.get("/secret", function (req, res) {
  res.send(`The current user is ${req.user.username}`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});

