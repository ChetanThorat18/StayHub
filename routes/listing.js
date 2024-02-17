const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// middleware function to be used as a parameter in routes
const validateListing = (req,res,next)=>{
    const result = listingSchema.validate(req.body);
    if(result.error){
        //let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        req.flash("success","New Listing Created!");   // Flash message ();
        next();
    }
}

// All /listings related routes 

// index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// New and Create Route for Listing
// New ---> GET request at /listings/new to collect Form data
// Create ---> POST request at /listings to add form data to database
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})
router.post("/",isLoggedIn,validateListing ,wrapAsync(async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    
    let listing = req.body.listing;
    // create instance of collection Listing to add it in database
    const newListing = new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Created!");   // Flash message 
    res.redirect("/listings");
}))

//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
// Update ---> PUT request at /listings/:id to Update Database
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    console.log("This is Edit Route");
    let {id} = req.params;
    const currentListing = await Listing.findById(id);
    if(! currentListing){
        req.flash("error","Listing You requested for does not exist!");   // Flash message 
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {currentListing});
}));
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");   // Flash message 
    res.redirect(`/listings/${id}`);
}))

// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs 
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    const {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted!");   // Flash message 
   res.redirect("/listings");
}))

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
router.get("/:id",wrapAsync(async (req,res)=>{
    let { id } =req.params;
    const currentListing = await Listing.findById(id).populate("reviews");

    if(! currentListing){
        req.flash("error","Listing You requested for does not exist!");   // Flash message 
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{currentListing});
}))



module.exports = router;