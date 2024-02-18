const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


const { saveRedirectUrl } = require("../middleware.js");
const {  renderSignUpForm , signupUser, renderLoginForm, loginUser, logoutUser} = require("../controllers/user.js");

router.get("/signup",renderSignUpForm)

router.post("/signup" , wrapAsync (signupUser));

router.get("/login",renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) , 
    loginUser
)

router.get("/logout",logoutUser)

module.exports = router;


