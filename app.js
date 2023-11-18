const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

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
 
// middleware function to be used as a parameter in routes
const validateListing = (req,res,next)=>{
    const result = listingSchema.validate(req.body);
    if(result.error){
        //let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}

// middleware function to be used as a parameter in routes
const validateReview = (req,res,next)=>{
    const result = reviewSchema.validate(req.body);
    if(result.error){
        //let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}

// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// New and Create Route for Listing
// New ---> GET request at /listings/new to collect Form data
// Create ---> POST request at /listings to add form data to database
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings",validateListing ,wrapAsync(async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    
    let listing = req.body.listing;
    // create instance of collection Listing to add it in database
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}))

//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
// Update ---> PUT request at /listings/:id to Update Database
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const currentListing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {currentListing});
}));
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs 
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    const {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}))

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let { id } =req.params;
    const currentListing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{currentListing});
}))

// Reviews
// Reviews POST Route
app.post("/listings/:id/reviews",validateReview ,wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}))

// DELETE review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}))

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