const debug = require('debug')('development:redirectIfLogin')
const redirectIfLogin = (req, res, next) => {
    try{
        if (req.cookies.token) {
            res.redirect("/profile");
          } else {
            next();
          }
    }catch(err){
        debug(err);
        return res.send("internal server error")
    }
  };
  
  module.exports = redirectIfLogin;