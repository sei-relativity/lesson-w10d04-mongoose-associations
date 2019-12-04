const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Food = require("./models/food");
const Ingredient = require("./models/ingredient");

const mongoURI = "mongodb://localhost/mongoRelationships";
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("the connection with mongod is established");
});

// CREATE TWO INGREDIENTS
const cheddar = new Ingredient({
  name: "cheddar cheese",
  origin: "Wisconson"
});

const dough = new Ingredient({
  name: "dough",
  origin: "Iowa"
});

// SAVE THE TWO INGREDIENTS SO
// WE HAVE ACCESS TO THEIR _IDS
cheddar.save(function(err, savedCheese) {
  if (err) {
    return console.log(err);
  } else {
    console.log("cheddar saved successfully");
  }
});

dough.save((err, savedCheese) => {
  if (err) {
    console.log(err);
  } else {
    console.log("dough saved successfully");
  }
});

// CREATE A NEW FOOD
const cheesyQuiche = new Food({
  name: "Quiche",
  ingredients: []
});

// PUSH THE INGREDIENTS ONTO THE FOOD'S
// INGREDIENTS ARRAY
cheesyQuiche.ingredients.push(cheddar); // associated!
cheesyQuiche.ingredients.push(dough);
cheesyQuiche.save(function(err, savedCheesyQuiche) {
  if (err) {
    return console.log(err);
  } else {
    console.log("cheesyQuiche food is ", savedCheesyQuiche);
  }
});
