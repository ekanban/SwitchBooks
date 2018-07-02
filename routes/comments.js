var express = require("express");
var router = express.Router({mergeParams: true});
var Book = require("../models/books.js");
var Comment = require("../models/comments.js");
var middleware = require("../middleware");


//NEW COMMENT ROUTE=====================
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("comments/newComment", {id: req.params.id});
})

//CREATE COMMENT ROUTE==================
router.post("/", function(req, res){
  var comment = req.body.comment;
  Book.findById(req.params.id, function(err, book){
    if(err){
      console.log("error at the new/create comment route");
    } else{
      Comment.create(comment, function(err, createdComment){
        if(err){
          console.log("error in Comment.create of create comment route");
        } else{
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          createdComment.save();
          book.comments.push(createdComment);
          book.save();
          // console.log("Added new comment");
          req.flash("success", "Comment added successfully");
          res.redirect("/books/"+req.params.id);
        }
      })
    }
  })
})

//EDIT COMMENT ROUTE===============
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
      if(err){
        console.log("error on the edit comment route");
      } else{
          res.render("comments/edit", {comment: comment, campgroundId: req.params.id});
        }
      })
})

//UPDATE COMMENT ROUTE=============
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
    if(err){
      console.log("error on the update comment route!!!");
    } else{
      req.flash("success", "Comment updated successfully");
      res.redirect("/books/" + req.params.id);
    }
  })
})

//DELETE COMMENT ROUTE=============
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndDelete(req.params.commentId, function(err){
    if(err){
      console.log("error on the delete comment route!!!");
    } else{
      req.flash("success", "Comment deleted successfully");
      res.redirect("/books/" + req.params.id);
    }
  })
})



module.exports = router;
