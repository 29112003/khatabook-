const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/login-middleware');
const hisaabModel = require("../models/hisaab-modal");
const userModel = require("../models/users-model")
const debug = require('debug')('development:hisaabRoute')

router.get('/',(req,res)=>{
    res.send("welcome to hisaab");
})

router.get('/create',isLoggedIn,(req,res)=>{
    res.render("create",{loggedin : true});
})







router.post("/create", isLoggedIn, async (req, res) => {
    try {
      const {title,description,shareable,encrypted,passcode,editPermission,} = req.body;

      debug(req.user.id)
      const hisaab = await hisaabModel.create({
        title,
        description,
        user: req.user.userId,
        shareable,
        encrypted,
        passcode,
        editPermission,
      });
  
      const user = await userModel.findOne({ _id: req.user.id });
      user.hisaab.push(hisaab._id);
      await user.save();
  
    //   res.redirect("/profile");
    res.send(hisaab)
    } catch (error) {
        debug(error)
    //   req.flash("error", true);
    //   res.redirect("/hisaab/create");
    res.send("Interval server error")
    }
  });

  router.get("/view/:id", isLoggedIn, async (req, res) => {
    try {
      const Hisaab = await hisaabModel.findOne({ _id: req.params.id });
      if(Hisaab.encrypted){
        debug(Hisaab)
        res.render("hisaabVerify",{Hisaab});
      }else{
        res.send("not excryted your can see the whole hisaab")
      }
    } catch (error) {
      debug(error);
      res.redirect("internal server error");
    }
  });
  router.post("/:id/passcode", isLoggedIn, async (req, res) => {
    try {
        var hisaab = await hisaabModel.findOne({_id : req.params.id});

        const passcode = Number(hisaab.passcode)
        debug(passcode);
        debug(Number(req.body.passcode));
        if( Number(req.body.passcode) === hisaab.passcode){
          req.session.hisaabvirefy = hisaab.id;
          res.redirect(`/hisaab/${req.params.id}/show`);
        }
        else{
          res.send("your passcode is invalid")
        }
    } catch (error) {
      debug(error);
      res.send("internal server error");
    }
  });
  router.get("/:id/show", isLoggedIn, async (req, res) => {
    try {
      debug(req.params.id)
      debug(req.session.hisaabvirefy)
        if(req.session.hisaabvirefy === req.params.id){
        return res.send("show")
      }else{
        return res.send("you passcode is incorrect")
      }
    } catch (error) {
      debug(error);
      res.send("internal server error");
    }
  });
  
  router.get("/delete/:id", isLoggedIn, async (req, res) => {
    try {
      const user = await userModel
        .findOne({ _id: req.user.userId })
        .populate("hisaab");
      await hisaabModel.findOneAndDelete({ _id: req.params.id });
      user.hisaab = user.hisaab.filter((h) => {
        return h._id.toString() !== req.params.id;
      });
  
      await user.save();
  
      res.redirect("/profile");
    } catch (error) {
      res.redirect("/error");
    }
  });
  

module.exports = router;