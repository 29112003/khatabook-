require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
require('./config/mongoose-connection');
const cookieParser = require('cookie-parser');
// flash connect set-up
const flash = require('connect-flash');
const expressSession = require('express-session');


const indexRouter = require('./routes/indexRoute');
const hisaabRouter = require('./routes/hisaabRoute');

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

// falsh connect set-up
app.use(
    expressSession({
      secret: process.env.session_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(flash());

app.use(cookieParser());

const debug = require("debug")("development:app")


app.use('/',indexRouter);
app.use('/hisaab',hisaabRouter);

app.listen(process.env.PORT,()=>{
    debug("server listening on port"+process.env.PORT);
});