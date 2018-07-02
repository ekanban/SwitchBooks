var express = require("express");
var router = express.Router();
var Book = require("../models/books.js")
var middleware = require("../middleware")
var User = require("../models/users.js")


router.get("/", function(req, res){
  Book.find({}, function(err, books){
    if(err){
      console.log("error at /books route");
    } else{
      res.render("books/books", {books: books});
      // console.log(req.user);
    }
  })
})

//NEW ROUTE===================
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("books/new");
})

//CREATE ROUTE================
router.post("/", middleware.isLoggedIn, function(req, res){
  var book = req.body.book;
  // console.log(req.user);
  User.findById(req.user._id, function(err, user){
    if (err) {
      console.log("error on book create/new route");
    } else{
      Book.create(book, function(err, book){
        if(err){
          console.log("error at create/new route");
        } else{
          book.submitter.username = req.user.username;
          book.submitter.id = req.user._id;
          book.save();
          user.books.push(book);
          user.save();
          req.flash("success", "Book added successfully");
          res.redirect("/books");
        }
      })

    }
  })

})

//SHOW ROUTE===================
router.get("/:id", function(req, res){
  Book.findById(req.params.id).populate("comments").exec(function(err, book){
    if(err){
      console.log("error at the show route");
      console.log(err);
    } else{
      res.render("books/show", {book: book});
    }
  })})

//EDIT ROUTE==================
router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, book){
       res.render("books/edit", {book: book});
})})

//UPDATE ROUTE===============
router.put("/:id", middleware.checkBookOwnership, function(req, res){
  Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, book){
    if(err){
      console.log("error on the update route");
    } else{
      req.flash("success", "Book updated successfully");
      res.redirect("/books/"+req.params.id);
    }
  })
})

//DELETE ROUTE===============
router.delete("/:id", middleware.checkBookOwnership, function(req, res){
  Book.findByIdAndDelete(req.params.id, function(err){
    if(err){
      console.log("error on the delete route");
    } else{
      req.flash("success", "Book deleted successfully");
      res.redirect("/books");
    }
  })
})




module.exports = router;
