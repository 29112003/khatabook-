const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/liger21");

const userSchema = mongoose.Schema({
    username:String,
    name:String,
    profilepicture:String,
    email:String,
    password:String,
    hisaab :{
        type:Array
    }
})

mongoose.model("user",userSchema)