const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    tweetText: String
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: ""
    },
    tweets: [tweetSchema]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);

module.exports = { User, Tweet };
