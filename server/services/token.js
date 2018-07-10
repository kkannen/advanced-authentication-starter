const jwt = require("jwt-simple");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ userId: user.id, iat: timestamp }, process.env.SECRET);
  console.log("TOKEN", token)
}


exports.tokenForUser = tokenForUser;

