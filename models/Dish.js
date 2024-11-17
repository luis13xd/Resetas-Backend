// models/Dish.js
import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      unitPrice: { type: Number, required: true },
    },
  ],
  price: { type: Number, required: true },
  totalCost: { type: Number, required: true }, 
  profit: { type: Number, required: true }, 
  margin: { type: Number, required: true }, 
});

const Dish = mongoose.model('Dish', dishSchema);

export default Dish;
