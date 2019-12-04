const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Food = require("./models/food");
const Ingredient = require("./models/ingredient");

const mongoURI = "mongodb://localhost:27017/mongoRelationships";
const port = 5000;

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("the connection with mongod is established");
});

app.listen(port, () => {
  console.log("listening");
});

// send all information for all foods
app.get("/api/foods/", (req, res) => {
  Food.find({})
    .populate("ingredients")
    .exec((err, foods) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      console.log(`found and populated all foods: ${foods}`);
      res.json(foods);
    });
});
