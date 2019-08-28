const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Food = require('./models/food');
const Ingredient = require('./models/ingredient');
const User = require('./models/user').User;
const Tweet = require('./models/user').Tweet;

const mongoURI = 'mongodb://localhost:27017/mongooseAssociationsInClass';

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log('Connected to Mongo');
});

app.use(express.json())

// INDEX FOOD
app.get('/api/foods', (req, res) => {
  Food.find({})
    .populate('ingredients')
    .exec((error, foods) => {
      res.json({ foods });
    })
})

// CREATE NEW USER
app.post('/api/users', (req, res) => {
  User.create(req.body, (error, newUser) => {
    res.json(newUser)
  })
})

// CREATE A TWEET
app.post('/api/users/:userId/tweets', (req, res) => {

  let newTweet = new Tweet({ text: req.body.text })

  User.findById(req.params.userId, (error, user) => {
    user.tweets.push(newTweet)
    user.save((error, savedUser) => {
      res.json(savedUser)
    })
  })
})

// USERS INDEX
app.get('/api/users', (req, res) => {
  User.find({}, (error, users) => {
    res.json(users);
  })
})

// SHOW USERS TWEETS
app.get('/api/users/:userId/tweets', (req, res) => {
  User.findById(req.params.userId, (error, user) => {
    res.json({ userTweets: user.tweets })
  })
})

// UPDATE A USER TWEET
app.put('/api/users/:userId/tweets/:tweetId', (req, res) => {
  User.findById(req.params.userId, (error, user) => {
    let tweetToUpdate = user.tweets.id(req.params.tweetId)

    tweetToUpdate.text = req.body.text
    user.save((error, savedUser) => {
      res.json(savedUser)
    })
  })
})





app.listen(3000, () => {
  console.log('Express is listening on port 3000');
});