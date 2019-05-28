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

// bookSchema.pre('save', function(next) {
//   console.log("Coming from pre.save middleware. Book Saved");
//   next();
// });

// bookSchema.post('findOneAndRemove', function(doc) {
//   console.log('%s has been removed', doc._id);
// });

// bookSchema.post('save', function(doc) {
//   console.log('%s has been saved', doc._id);
// });

module.exports = mongoose.model("Book", bookSchema);
