const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

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