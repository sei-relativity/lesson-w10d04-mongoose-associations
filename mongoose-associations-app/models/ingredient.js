const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      default: ""
    },
    origin: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
