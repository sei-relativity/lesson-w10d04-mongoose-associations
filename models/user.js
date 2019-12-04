var mongoose = require("mongoose");
var Schema = mongoose.Schema;
	
var tweetSchema = new Schema({
  tweetText: String
}, { timestamps: true });
	
var userSchema = new Schema({
  name: {
    type: String,
    default: ""
  },
  tweets: [tweetSchema]
}, { timestamps: true });
	
var User = mongoose.model("User", userSchema);
var Tweet = mongoose.model("Tweet", tweetSchema);
	
module.exports = { User, Tweet }	