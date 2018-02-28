const express = require("express");
const {signUp,signIn,authorization} = require( "../controllers/AuthenticationController");

const router = express.Router();

router.post("/api/signup",signUp );
router.post("/api/signin", signIn);
router.use(authorization);

module.exports = router;
