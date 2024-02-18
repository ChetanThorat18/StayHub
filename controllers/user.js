const User = require("../models/user.js");
const passport = require("passport");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupUser = async(req,res)=>{
    try{
        let {username , email , password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        // Automatic Login after Succesful Sign Up
        req.login(registeredUser,(err)=>{
           if(err){
            return next(err);
           } 
           req.flash("success","Welcome to StayHub");
           res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser = async(req,res)=>{
    req.flash("success","Welcome to StayHub!");
    // Redirect to User's desired route (Saved in isLoggedIn middleware)
    if(res.locals.redirectURL){
        res.redirect(res.locals.redirectURL);
    }else{
        res.redirect("/listings");
    }
    
}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listings")
    })
}