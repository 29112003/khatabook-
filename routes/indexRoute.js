const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middlewares/login-middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/users-model');
const debug = require('debug')("development:indexRoute");

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

            debug(email, username, password);

            const user = await userModel.findOne({email})

            debug(user)

            if(user){
                debug("user already exists")
                return res.status(409).send("user already exist");
            }
            debug(user)
                    
            const salt =await bcrypt.genSalt(11);
            debug(salt);
            const hash = await bcrypt.hash(password, salt);
            debug(hash);
                    
            const createdUser =  await userModel.create({
                email,
                username,
                password:hash
                })
                debug(createdUser);            
                
                var token = jwt.sign({ email , id : createdUser._id }, process.env.SECRET);
                debug(token)
                res.cookie("token",token);
                // res.render("profile",{user});
                res.status(202).send(createdUser);
                    
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
        res.clearCookie("token");
        res.redirect("login");
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

router.post('/login', async (req, res) => {
    try {
        const { password, email } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        debug(email , password)
        const user = await userModel.findOne({ email }).select('+password');

        debug(user)
        if (!user) {
            return res.status(401).send("Invalid email or password");
        }

        debug("result")
        const result = await bcrypt.compare(password,user.password);

        if(!result){
            debug("password mismatch")
            return res.status(401).send("email and password are not correct");
        }

        const token = jwt.sign({email,id : user._id}, process.env.SECRET);

        res.cookie("token",token);
        res.send(user)
    } catch (err) {
        debug(err);
        res.status(500).send("Internal server error");
    }
});

// router.get('/profile',(req,res)=>{
//     res.render(profile);
// })

router.get('/profile',isLoggedIn,(req,res)=>{
    res.send("hello",{user : res.user,loggedin : true});
})

module.exports = router;