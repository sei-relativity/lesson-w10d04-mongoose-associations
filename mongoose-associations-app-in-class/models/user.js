const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  text: String
})

const userSchema = new Schema({
  name: String,
  tweets: [tweetSchema]
})

const Tweet = mongoose.model('Tweet', tweetSchema);
const User = mongoose.model('User', userSchema);

module.exports = { User, Tweet }