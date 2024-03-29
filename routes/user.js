const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignUpForm,
  signupUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} = require("../controllers/user.js");

router
   .route("/signup")
   .get(renderSignUpForm)
   .post(wrapAsync(signupUser));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    loginUser
  );

router.get("/logout", logoutUser);

module.exports = router;
