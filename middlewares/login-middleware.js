const debug = require('debug')("development:login-middleware")

const jwt = require('jsonwebtoken');


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

module.exports = isLoggedIn