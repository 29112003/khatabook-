const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/mongoose-connection');

const indexRouter = require('./routes/indexRoute');
const cookieParser = require('cookie-parser');

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/',indexRouter);

app.listen(process.env.PORT||3000);