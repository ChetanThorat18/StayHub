// define listing schema , create listing model and export it

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : {
       type:String,
       required:true,
    },
    description : String,
    image : {
        type:String,
        default:"https://unsplash.com/photos/man-in-purple-suit-jacket-using-laptop-computer-05XcCfTOzN4" ,
        set:(v)=> v===""  ? "https://unsplash.com/photos/man-in-purple-suit-jacket-using-laptop-computer-05XcCfTOzN4" : v,
    },
    price : Number,
    location:String,
    country:String,
});

// create Collection (model) "Listing"
const Listing = mongoose.model("Listing",listingSchema);

// export model
module.exports = Listing;