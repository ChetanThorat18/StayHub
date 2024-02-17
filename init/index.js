const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });
// connect to mongoDB
async function main() {
  await mongoose.connect(
    "mongodb+srv://ChetanThorat18:MongoAtlas%40123@myproject.qung7za.mongodb.net/StayHub"
  );
}

// initialize database (delete Existing data if any)
const initDB = async () => {
  await Listing.deleteMany({});
  // Adding Default Owner To all listings
  initData.data = initData.data.map((eachListing) => ({
    ...eachListing,
    owner: "65d05d2c9d1cb629dff81be0",
  }));
  await Listing.insertMany(initData.data);
  console.log("DataBase Reinitialized..!");
};

initDB();
