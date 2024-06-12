const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/liger21");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:20,
    },
    profilepicture:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    hisaab :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hisaab"
    }]
})

module.exports = mongoose.model("user",userSchema)