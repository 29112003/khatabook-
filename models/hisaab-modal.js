const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/liger21");

const hisaabSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:3,
        maxLength:100,
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    encrypted:{
        type:Boolean,
        default:false
    },
    shareable:{
        type:Boolean,
        default:false
    },
    passcode:{
        type:String,
        default:""
    },
    editpermissions:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Hisaab",hisaabSchema);