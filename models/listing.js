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
        type:String,
        default:"https://unsplash.com/phothttps://images.unsplash.com/photo-1626178793926-22b28830aa30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dos/man-in-purple-suit-jacket-using-laptop-computer-05XcCfTOzN4" ,
        set:(v)=> v===""  ? "https://https://images.unsplash.com/photo-1626178793926-22b28830aa30?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D.com/photos/man-in-purple-suit-jacket-using-laptop-computer-05XcCfTOzN4" : v,
    },
    price : Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
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