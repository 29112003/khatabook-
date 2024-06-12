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
      const hisaab = await hisaabModel.findOne({ _id: req.params.id });
      res.render("view", { hisaab });
    } catch (error) {
      res.redirect("/error");
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