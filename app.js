const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js"); 
const reviews = require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log(err);
})
// connect to mongoDB Atlas
async function main(){
    await mongoose.connect('mongodb+srv://ChetanThorat18:MongoAtlas%40123@myproject.qung7za.mongodb.net/StayHub');
}

app.get("/",(req,res)=>{
    res.send("Root directory working..!");
});
 
// Refer to listings in routes/listing.js for all those routes with /listings
app.use("/listings",listings);
// Refer to reviews in routes/review.js for all those routes with /listings/:id/reviews
app.use("/listings/:id/reviews",reviews);

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
app.listen(8080,(req,res)=>{
    console.log("server is listening at port 8080");
}); 