const User = require("../models/UserModel");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jwt-simple");


function authorization(request, response,next) {

  // get the token from the header
  const tokenString = request.header("authorization");
  const tokenObject = jwt.decode(tokenString,process.env.SECRET);
  // decrypt the token
  // find user by id
  User.findById(tokenObject.userId, function (err, user) {
    if (err) { return response.send("Error"); }
    if (user) {
      request.user = user;
      return next();
    } 
    return response.send("Invalid credentials");

  });
}






function signIn(req, res) {
  const { username, password } = req.body;
  console.log("Looking for a user with the username",username);
  
  User.findOne({ username }).exec()
  .then(user => {
    // If there is no user found call done with a `null` argument, signifying no error
    // and `false` signifying that the signin failed
    if (!user) {
      console.log("No user found with this username",username);
      return res.send("No user found with this username");
    }

    bcrypt.compare(password, user.password, function (err, isMatch) {
      // If there is an error call done with our error
      if (err) {
        return res.send("Error occured");
      }

      // If the passwords do not match call done with a `null` argument, signifying no error
      // and `false` signifying that the signin failed
      if (!isMatch) {
        return res.send("Invalid password");
      }
      console.log("The username was found and the passwords matched",username);
      // If we have no errors and the passwords match
      // call done with a `null` argument, signifying no error
      // and with the now signed in user
      const token = tokenForUser(user);
      res.json({ token});
    });
  }).catch(() => {
    return res.send("Error occured");
  });
}
function signUp(req, res, next) {
  const { username, password } = req.body;
  const u = username;
  // If no username or password was supplied return an error
  if (!username || !password) {
    return res.status(422)
      .json({ error: "You must provide an username and password" });
  }
  console.log("Look for a user with the username");
  User.findOne({ username: u}).exec()
  .then((existingUser) => {
    // If the user exist return an error on sign up
    if (existingUser) {
      console.log("This username is already being used");
      return res.status(422).json({ error: "Username is in use" });
    }
    console.log("This username is free to use");
    saveUser(username,password,res,next);
  })
  .catch(err => next(err));
}
function saveUser(username,password,res,next) {
  // User bcrypt to has their password, remember, we never save plain text passwords!
  bcrypt.genSalt(10, function (err, salt) {
    console.log("the salt",salt);
    bcrypt.hash(password, salt, null, function (hashErr, hashedPassword) {
      if (hashErr) {
        return next(hashErr);
      }
      // Create a new user with the supplied username, and the hashed password
      const user = new User({ username, password: hashedPassword });
      console.log("Saving the user");
      user.save()
         .then(u => {
           console.log("User has been saved to database");
           res.json({ token: tokenForUser(u) });
         });
    });
  });
}
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ userId: user.id, iat: timestamp }, process.env.SECRET);
}

exports.signIn = signIn;
exports.signUp = signUp;
exports.authorization = authorization;
