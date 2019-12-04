//Require NPM Packages
const express = require('express');
const mongoose = require('mongoose');

//Require routes file
const userRoutes = require('./user_routes')

//Require DB configratioin file

// PORT
const port = 3000;

//create Express App
const app = express();


//Establish DB connection
mongoose.connect('mongodb://localhost:27017/mongoRelationships', {useNewUrlParser: true}, ()=> {
    console.log("Connected to MongoDB")
});

/****Middleware****/
//add body Parser middleware
//meaning to make all data in JSON
app.use(express.json());

/***Routes***/
app.use(userRoutes);


// Run API on designated Port
app.listen(port, ()=>{
  console.log(`App is listening at port ${port}`)
});
