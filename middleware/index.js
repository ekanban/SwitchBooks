var Book = require("../models/books.js")
var Comment = require("../models/comments.js")


var middleware = {
  isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else{
      req.flash("negative", "You must be logged in to do that!");
      res.redirect("/login");
    }},
  checkBookOwnership: function(req, res, next){
    if(req.isAuthenticated()){
      Book.findById(req.params.id, function(err, book){
        if (err){
          console.log("error on the edit route");
        } else{
          if(book.submitter.id.equals(req.user._id)){
            next();
          } else{
            req.flash("negative", "You don't have permission to do that!");
            res.redirect("back");
          }
        }
    })
  } else{
      req.flash("negative", "You must be logged in to do that!");
      res.redirect("/login");
    }
  },
  checkCommentOwnership: function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.commentId, function(err, comment){
        if(err){
          console.log("error on the edit comment route");
        } else{
          if(comment.author.id.equals(req.user._id)){
            next();
          } else{
            res.redirect("back")
          }
        }
      })
    } else{
        res.redirect("back");
      }
  }
}




module.exports = middleware;
