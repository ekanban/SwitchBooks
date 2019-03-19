var express = require("express");
var router = express.Router();
var User = require("../models/users.js");
var Book = require("../models/books.js");
var middleware = require("../middleware")
var nodemailer = require('nodemailer');



//User Profile Page
router.get("/users/:id", function(req, res){
  User.findById(req.params.id).populate("books").exec(function(err, user){
    if(err){
      console.log("error on the user Profile page route");
      console.log(err);
    } else{
      res.render("users/profilePage.ejs", {user: user});
    }
  })
})

//Switch BookShelf
router.post("/users/:userId/switchbooks/:bookId", middleware.isLoggedIn, function(req, res){
  Book.findById(req.params.bookId, function(err, book){
    if(err){
      console.log("error on the switchbooks route");
      console.log(err);
    } else{
      User.findById(req.params.userId, function(err, user){
        if(err){
          console.log("error on the switchbooks route");
          console.log(err);
        } else{
            User.findById(req.user._id).populate("books").exec(function(err, currentuser){
              if(currentuser.books.length == 0){
                req.flash("negative", "You don't have any books to switch with. Please add a book before proceeding");
                res.redirect(`/books/${req.params.bookId}`);
              } else{
                res.render("users/switchBooks", {user: user, book: book, currentuser});
              }


    })}})}})})

//Send Mail
// :userId = id of user to whom request is being sent to
// :bookId = id of book that is being asked for
// :offerBookId = id of book that is being offered
router.get("/users/:userId/switchbooks/:bookId/:offeredBookId/confirm", middleware.isLoggedIn, function(req, res){
  Book.findById(req.params.bookId, function(err, askedBook){
    if(err){
      console.log("error on the switchbooks route");
      console.log(err);
    } else{
      User.findById(req.params.userId, function(err, user){
        if(err){
          console.log("error on the switchbooks route");
          console.log(err);
        } else{
            Book.findById(req.params.offeredBookId, function(err, offeredBook){
              if(err){
                console.log("error on the switchbooks route");
                console.log(err);
              } else{
                  User.findById(req.user._id, function(err, buyerUser){
                    var newDealSent = {
                      sentToPerson: {
                        id: req.params.userId,
                        username: user.username
                      },
                      askedBook: {
                        id: req.params.bookId,
                        title: askedBook.title
                      },
                      offeredBook: {
                        id: req.params.offeredBookId,
                        title: offeredBook.title
                      }
                    };
                    buyerUser.dealsSent.push(newDealSent);
                    buyerUser.save();
                    var newDealReceived = {
                      receivedFromPerson: {
                        id: req.user._id,
                        username: buyerUser.username
                      },
                      askedBook: {
                        id: req.params.bookId,
                        title: askedBook.title
                      },
                      offeredBook: {
                        id: req.params.offeredBookId,
                        title: offeredBook.title
                      }
                    };
                    user.dealsReceived.push(newDealReceived);
                    user.save();
                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'switchbooks101@gmail.com',
                        pass: '$witch10@'
                      }
                    });

                    var mailOptions = {
                      from: 'switchbooks101@gmail.com',
                      to: user.email,
                      subject: 'Switch request',
                      text: `${req.user.username} sent you a switch request for ${askedBook.title}! He's willing to offer ${offeredBook.title} in return. Visit: https://www.google.com`
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        req.flash("success", "Request mail sent successfully");
                        res.redirect(`/users/${req.user._id}/sentDeals`);
                      }
                    });
                  })

    }})}})}  })})

//SENT DEALS
router.get("/users/:userId/sentDeals", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.userId, function(err, user){
    res.render("users/sentDeal", {user: user})
  })
})

//RECEIVED DEALS
router.get("/users/:userId/receivedDeals", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.userId, function(err, user){
    res.render("users/receivedDeal", {user: user})
  })
})

module.exports = router;
