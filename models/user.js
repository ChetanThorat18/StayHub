const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    // Passport by-default defines username and password
})

userSchema.plugin(passportLocalMongoose);  // Includes in-built functionality of username and password

module.exports = mongoose.model('User',userSchema);