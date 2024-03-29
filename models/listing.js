// define listing schema , create listing model and export it

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
       type:String,
       required:true,
    },
    description : String,
    image : {
        url : String,
        imgName : String,
    },
    price : Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

// POST middleware to DELETE corresponding reviews from database upon deleting the listing
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}})
    }
    
});

// create Collection (model) "Listing"
const Listing = mongoose.model("Listing",listingSchema);

// export model
module.exports = Listing;