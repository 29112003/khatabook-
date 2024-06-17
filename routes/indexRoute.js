const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/login-middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/users-model');
const debug = require('debug')("development:indexRoute");
const redirectIfLogin = require('../middlewares/redirectIfLogin')

router.get('/register',(req,res)=>{
    res.render("register");
})



// SECRET
router.post('/register',async (req,res)=>{
    try{
        if(!process.env.SECRET){
            debug("create the secret key first");
            return res.status(500).send("internal server error");
        }
            const {email , username , password} = req.body;

            const user = await userModel.findOne({email})

            if(user){
                debug("user already exists")
                req.flash("error","user already exists")
                return res.redirect("/register");
            }
                    
            const salt =await bcrypt.genSalt(11);
            const hash = await bcrypt.hash(password, salt);
                    
            const createdUser =  await userModel.create({
                email,
                username,
                password:hash
                })
                debug(createdUser);            
                
                var token = jwt.sign({ email , id : createdUser._id }, process.env.SECRET);
                debug(token)
                res.cookie("token",token);
                return res.redirect("/profile");
                    
        }catch(err){
            debug(err);
            return res.status(500).send("Internal Server Error");
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
        if(req.session){
            req.session.destroy(err => {
                if (err) {
                    return res.send("Failed to destroy session");
                }
                debug("Session destroyed successfully");
            });
        }
        res.clearCookie("token");
        res.redirect("login");
    }catch(err){
        debug(err)
    }
})


router.post('/login', async (req, res) => {
    try {
        const { password, email } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            req.flash("error", "Invalid credentials");
            return res.redirect("/");
        }

        const result = await bcrypt.compare(password,user.password);

        if(!result){
            req.flash("error", "Invalid credentials");
            return res.redirect("/");
        }

        const token = jwt.sign({email,id : user._id}, process.env.SECRET);

        res.cookie("token",token);
        res.redirect("/profile");
    } catch (err) {
        debug(err);
        return res.status(500).send("Internal server error");
    }
});

router.get("/profile", isLoggedIn, async (req, res) => {
    let byDate = Number(req.query.byDate);
    let {startDate, endDate} = req.query

    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1900-01-01")
    endDate = endDate ? endDate : new Date();

    const user = await userModel.findOne({email : req.user.email}).populate({
        path:"hisaab",
        match:{createdAt : {$gte : startDate , $lte : endDate}} ,
        options:{
            sort : { createdAt : byDate }
        }
    })
    res.render("profile", { user});
  });


router.get('/error',(req,res)=>{
    res.render("error");
})

module.exports = router;