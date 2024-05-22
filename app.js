const express = require("express");
const app = express();
const path = require('path');
const userModel = require('./models/users-model');
const mongooseConnection = require('./config/mongoose-connection');

app.set("view engine" , "ejs");
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render("index");
})
app.get('/register',(req,res)=>{
    res.render("register");
})

app.listen(process.env.PORT||3000);