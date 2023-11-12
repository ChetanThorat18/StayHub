const express  = require("express");
const app = express();
const mongoose = require("mongoose");


main().then(()=>{
    console.log("connected to database!");
}).catch((err)=>{
    console.log(err);
})
// connect to mongoDB 
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Project');
}


app.get("/",(req,res)=>{
    res.send("Root directory working..!");
});


// start the server
app.listen(8080,(req,res)=>{
    console.log("server is listening at port 8080");
});