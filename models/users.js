var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }
  ],
  dealsSent: [
    {
      sentToPerson: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
      },
      askedBook: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book"
        },
        title: String
      },
      offeredBook: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book"
        },
        title: String
    },
    accept: {
      type: String,
      default: "no"
    }
  }
  ],
  dealsReceived: [
    {
      receivedFromPerson: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
      },
      askedBook: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book"
        },
        title: String
      },
      offeredBook: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book"
        },
        title: String
    },
    accept: {
      type: String,
      default: "no"
    }
    }
  ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
