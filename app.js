var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var expressSession = require("express-session");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var bookRoutes = require("./routes/books.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");
var usersRoutes = require("./routes/users.js");

// mongoose.connect("mongodb://localhost/switchbooks");
mongoose.connect("mongodb://acebansal:barter10@ds153890.mlab.com:53890/barter");


var Book = require("./models/books.js");
var Comment = require("./models/comments.js");
var User = require("./models/users.js");

app.use(flash());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(expressSession({
  secret: "My name is Ekansh",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.negative = req.flash("negative");
  return next();
})

app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use(usersRoutes);



function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else{
    res.render("login");
  }
}



app.listen(process.env.PORT, process.env.IP);
// app.listen(3000, function(){
//   console.log("The server has started")
// })
