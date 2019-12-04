
const express = require('express');
// Pull in Mongoose model for Log
var User = require('./models/user').User
var Tweet = require('./models/user').Tweet

// Instantiate a router (mini app that only handle routes)
const router = express.Router();




//all user
router.get('/api/users/', (req, res) => {
  User.find({}, (error, foundUser) => {
    res.send(foundUser)
    
  });
});

//new user
router.post('/api/users', (req, res) => {
  User.create(req.body, (error, newUser) => {
    res.json(newUser);
  })
})


//update user
router.put('/api/users/:userId/', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;

  // find user in db by id
  User.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    // update tweet text and completed with data from request body
    foundUser.name = req.body.name;
    foundUser.save((err, savedUser) => {
      res.json(savedUser);
    });
  });
});

//delete user
router.delete('/api/users/:userId/', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;

  // find user in db by id
  User.findOneAndDelete({_id : userId}, (err, foundUser) => {
      res.json(foundUser);
  });
});



// get all tweets
router.get('/api/users/:userId/tweets', (req, res) => {
  
  // find user in db by id and add new tweet
  User.findById(req.params.userId, (error, foundUser) => {
    res.send(foundUser.tweets)
    
  });
});

// create tweet embedded in user
router.post('/api/users/:userId/tweets', (req, res) => {
  // store new tweet in memory with data from request body
  var newTweet = new Tweet({ tweetText: req.body.tweetText });

  // find user in db by id and add new tweet
  User.findById(req.params.userId, (error, foundUser) => {
    foundUser.tweets.push(newTweet);
    foundUser.save((err, savedUser) => {
      res.json(savedUser);
    });
  });
});

//get tweet by ID
router.get('/api/users/:userId/tweets/:id', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;
  var tweetId = req.params.id;

  // find user in db by id
  User.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    var foundTweet = foundUser.tweets.id(tweetId);
    // update tweet text and completed with data from request body
    res.send(foundTweet)
  });
});

// update tweet embedded in user
router.put('/api/users/:userId/tweets/:id', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;
  var tweetId = req.params.id;

  // find user in db by id
  User.findById(userId, (err, foundUser) => {
    // find tweet embedded in user
    var foundTweet = foundUser.tweets.id(tweetId);
    // update tweet text and completed with data from request body
    foundTweet.tweetText = req.body.tweetText;
    foundUser.save();
    res.json(foundTweet);
  });
});

//delete tweet
router.delete('/api/users/:userId/tweets/:id', (req, res) => {
  // set the value of the user and tweet ids
  var userId = req.params.userId;
  var tweetId = req.params.id;

  // find user in db by id
  User.findById(userId, (err, foundUser) => {
    // find tweet embedded in user

    if(foundUser.tweets.id(tweetId)){
    foundUser.tweets.id(tweetId).remove();

      // findTweet.remove
    foundUser.save();}
    res.json(foundUser);
  });
});

module.exports = router;
