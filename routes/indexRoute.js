const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/users-model');


const debug = require('debug')("development:indexRoute");

router.get('/register',(req,res)=>{
    res.render("register");
})

// check whether the user exist or not if that email vala person already exist so give them already exist
// generate hash password
// create in mongo
// create token form jwt and save it and remember save two fields email and id
// send for checking



// SECRET
router.post('/register',async (req,res)=>{
    console.log("starting register route")
    try{
        if(process.env.SECRET){
            const {email , username , password} = req.body;

            const user = await userModel.findOne({email})

            if(user){
                //user is already exist with email
                return res.send("user already exist");
            }else{
                
                    bcrypt.genSalt(11, function(err, salt) {
                        bcrypt.hash(password, salt,async function(err, hash) {
                            const user =  await userModel.create({
                                email,
                                username,
                                password:hash
                            })
                            
                            var token = jwt.sign({ email , id : user._id }, process.env.SECRET);
                            res.cookie("token",token);
                            res.send(user);
                        });
                    });

                
            }
        }
    }catch(err){
            debug(err);
        }
})

router.get('/login',(req,res)=>{
    try{
        res.render("login")
    }catch(err){
        debug(err)
    }
})
router.get('/logout',isLoggedIn,(req,res)=>{
    try{
        res.clearCookie("token");
        res.send("cookie was deleted");
    }catch(err){
        debug(err)
    }
})

// for login one 
// checking the key
// validation of email in out mongo
// check the password
// generate cookie and send it
// hello from profile

router.post('/login', async (req,res)=>{
    try{
        const {password, email} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.send("your email and password is invalid");
        }else{
            // checking for the password
            
            bcrypt.compare(password, user.password, function(err, result) {
                if(err){
                    debug(err);
                }else{
                    if(result){
                        jwt.sign({email,id : user._id }, process.env.SECRET, function(err, token) {
                            if(err){
                                debug(err);
                            }
                            res.cookie("token",token);
                            res.send("profile");
                            });
                    }else{
                        res.send("your email and password is invalid");
                    }
                }
            });
        }
    }catch(err){
        debug(err);
    }
})



function isLoggedIn(req,res,next){
    try{
        if(req.cookies.token){
            if(process.env.SECRET){
                jwt.verify(req.cookies.token, process.env.SECRET, function(err, decoded) {
                    req.user = decoded;
                    next();
                });
            }
        }
        else{
            res.redirect("login");
        }
    }catch(err){
        debug(err);
    }
}
router.get('/profile',isLoggedIn,(req,res)=>{
    res.send("hello");
})

module.exports = router;