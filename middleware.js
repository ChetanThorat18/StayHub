module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // Save URL Where user was supposed to Redirect before Login
        req.session.redirectURL = req.originalUrl;

        req.flash("error","You must be Logged In !");
       return res.redirect("/login");
    }
    next();
}

// Passport Clears the info stored in Session after redireting to route
// Hence We are saving it in res.locals
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }

    next();
}