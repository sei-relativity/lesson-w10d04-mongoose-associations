const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  text: String,
  date: Date
});

const userSchema = new Schema({
  name: String,
  // embed tweets in user
  tweets: [tweetSchema]
});

const User = mongoose.model("User", userSchema);
const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = { User, Tweet };
