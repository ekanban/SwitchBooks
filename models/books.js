var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  image: String,
  summary: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  submitter: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
})

module.exports = mongoose.model("Book", bookSchema);
