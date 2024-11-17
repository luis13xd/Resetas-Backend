import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  unitCost: { type: Number, required: true },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
