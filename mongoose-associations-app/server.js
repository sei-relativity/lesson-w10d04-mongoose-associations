const express = require("express");
const app = express();
const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/mongoRelationships";
const port = 5000;

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("the connection with mongod is established");
});

app.listen(port, () => {
  console.log("listening");
});
