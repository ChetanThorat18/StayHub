const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

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

// index route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// New and Create Route for Listing
// New ---> GET request at /listings/new to collect Form data
// Create ---> POST request at /listings to add form data to database
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})
app.post("/listings",async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    let listing = req.body.listing;
    // create instance of collection Listing to add it in database
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
// Update ---> PUT request at /listings/:id to Update Database
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const currentListing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {currentListing});
});
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs 
app.delete("/listings/:id",async (req,res)=>{
    const {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
})

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
app.get("/listings/:id",async (req,res)=>{
    let { id } =req.params;
    const currentListing = await Listing.findById(id);
    res.render("listings/show.ejs",{currentListing});
})

// start the server
app.listen(8080,(req,res)=>{
    console.log("server is listening at port 8080");
});