const express = require("express");
const app = express();
const path = require('path');
const userModel = require('./models/users-model');
const mongooseConnection = require('./config/mongoose-connection');
const debug = require('debug')("development:mainfile");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

debug("abhi tho start kiya");

app.set("view engine" , "ejs");
app.use(cookieParser())
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))

// REDSEA
app.get('/',(req,res)=>{
    res.render("register");
})
app.post('/register', async (req,res)=>{
    const {password , username , email} = req.body;

    // check if user already exist or not 

    const user = userModel.findOne({email});
    if(!user)return res.send("user already exist");

    bcrypt.genSalt(11,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            const createdUser = await userModel.create({
                username,
                email,
                password:hash
            })
            let token = jwt.sign(createdUser.email,process.env.REDSEA)
            res.cookie("token" , token);
            res.send(createdUser);
        })
    })
    
})

app.listen(process.env.PORT||3000);``