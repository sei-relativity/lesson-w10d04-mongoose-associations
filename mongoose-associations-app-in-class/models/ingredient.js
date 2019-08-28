const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  origin: { type: String, default: 'Earth' }
}, { timestamps: true })

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient