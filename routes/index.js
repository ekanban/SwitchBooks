var express = require("express");
var router = express.Router();
var User = require("../models/users.js");
var passport = require("passport");

//INDEX ROUTE==================
router.get("/", function(req, res){
  res.render("landing");
})
//==============================================================================
//=================================AUTH ROUTES==================================
//==============================================================================

//REGISTER ROUTES======================
router.get("/register", function(req, res){
  res.render("register");
})

router.post("/register", function(req, res){
  User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      console.log("error on the register route");
      req.flash("negative", err.message);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to SwitchBooks, " + user.username + "!");
        res.redirect("/books");
      })
    }
  })
})

//LOGIN ROUTES========================
router.get("/login", function(req, res){
  res.render("login");
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/books",
  failureRedirect: "/login"
}), function(req, res){
})

//LOGOUT ROUTE=========================
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/");
})


module.exports = router;
