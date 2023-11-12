const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


main().then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log(err);
})
// connect to mongoDB 
async function main(){
    await mongoose.connect('mongodb+srv://ChetanThorat18:MongoAtlas%40123@myproject.qung7za.mongodb.net/StayHub');
    
}

// initialize database (delete Existing data if any)
const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialized..!");
}

initDB();