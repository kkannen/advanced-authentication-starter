// dotenv allows us to declare environment variables in a .env file, \
// find out more here https://github.com/motdotla/dotenv
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authenticationRoutes = require("./routes/AuthenticationRoutes");

mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://jwoo:jwoo@ds147668.mlab.com:47668/aca-test");

const app = express();

app.use(bodyParser.json());
app.use(authenticationRoutes);

app.get("/api/canigetthis", function (req, res) {
  res.send("You got the data. You are authenticated");
});
app.get("/api/secret", function (req, res) {
  res.send(`The current user is ${req.user.username}`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
