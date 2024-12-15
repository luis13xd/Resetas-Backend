import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Ingredient from "./models/Ingredient.js";
import Dish from "./models/Dish.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

app.get("/api/ingredients", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).send("Error al obtener los ingredientes");
  }
});
app.post("/api/ingredients", async (req, res) => {
  const { name, unit, quantity, price } = req.body;
  const unitCost = price / quantity; // Calcula el costo por unidad

  try {
    const newIngredient = new Ingredient({
      name,
      unit,
      quantity,
      price,
      unitCost,
    });
    await newIngredient.save();
    res.status(201).send(newIngredient);
  } catch (error) {
    res.status(500).send("Error al guardar el ingrediente");
  }
});
// Ruta para actualizar un ingrediente
app.put("/api/ingredients/:id", async (req, res) => {
  const { name, unit, quantity, price } = req.body;

  try {
    const updatedData = {
      name,
      unit,
      quantity,
      price,
      unitCost: price / quantity, // Recalcular el costo por unidad
    };

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true } // Devuelve el documento actualizado
    );

    if (!ingredient) {
      return res.status(404).send("Ingrediente no encontrado");
    }

    res.json(ingredient);
  } catch (error) {
    res.status(500).send("Error al actualizar el ingrediente");
  }
});


  
// Ruta para eliminar un ingrediente
app.delete("/api/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).send("Ingrediente no encontrado");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error al eliminar el ingrediente");
  }
});

// Rutas para platos (nuevas rutas a agregar)
app.get("/api/dishes", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).send("Error al obtener los platos");
  }
});

app.post("/api/dishes", async (req, res) => {
  const { name, ingredients, price, totalCost, profit, margin } = req.body;
  try {
    const newDish = new Dish({
      name,
      ingredients,
      price,
      totalCost,
      profit,
      margin,
    });
    await newDish.save();

    // Actualiza el inventario de ingredientes
    for (const ingredient of ingredients) {
      const ingredientInDb = await Ingredient.findOne({
        name: ingredient.name,
      });
      if (ingredientInDb) {
        ingredientInDb.quantity -= ingredient.quantity;
        await ingredientInDb.save();
      }
    }

    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).send("Error al crear el plato");
  }
});

app.delete("/api/dishes/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).send("Plato no encontrado");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Error al eliminar el plato");
  }
});

app.put("/api/dishes/:id", async (req, res) => {
  const { name, ingredients, price, totalCost, profit, margin } = req.body;

  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name, ingredients, price, totalCost, profit, margin },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedDish) {
      return res.status(404).send("Plato no encontrado");
    }

    res.json(updatedDish);
  } catch (error) {
    res.status(500).send("Error al actualizar el plato");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en Puerto: ${PORT}`);
});
