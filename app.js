if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js"); 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const Atlas_DB_URL = process.env.MONGO_ATLAS_URL;

// Mongo Session
const store = MongoStore.create({
    mongoUrl : Atlas_DB_URL,
    crypto:{
        secret:  process.env.SESSION_SECRET 
    },
    touchAfter:24*3600,
})
 
store.on("error",()=>{
    console.log("Error in Mongo-Session Store",err);
})

// session options to be passed to session() 
const sessionOptions = {
    store,
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, // 7 days , 24 hrs(each day) , 60 min(each hour) , 60 sec(each min) , 1000ms (of each sec)
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log(err);
})
// connect to mongoDB Atlas
async function main(){
    await mongoose.connect(Atlas_DB_URL);
}

// Flash-message middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Refer to listingsRouter in routes/listing.js for all those routes with /listings
app.use("/listings",listingsRouter);
// Refer to reviewsRouter in routes/review.js for all those routes with /listings/:id/reviews
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
 

// Error Handling Middleware for Invalid Route(If req doesn't match to any of above route)
app.use("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"))
})
  
// Error Handling Middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs" , {message});
})

// start the server
app.listen(3000,(req,res)=>{
    console.log("server is listening at port 8080");
}); 
