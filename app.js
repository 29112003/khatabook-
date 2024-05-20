const express = require("express");
const app = express();


app.get('/',(req,res)=>{
    res.send("kaise ho app log");
})

app.listen(process.env.PORT||3000);