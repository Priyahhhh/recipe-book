import express from "express";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

const router = express.Router();

// Add recipe
router.post("/add", async (req, res) => {
  try {
    const { title, description, ingredients, steps, authorId } = req.body;

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      author: authorId,
    });

    await recipe.save();
    res.json({ msg: "Recipe added", recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("author", "username");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search by recipe name
router.get("/search/:title", async (req, res) => {
  try {
    const recipes = await Recipe.find({
      title: { $regex: req.params.title, $options: "i" },
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a recipe
router.post("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    recipe.likesCount += 1;
    await recipe.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { likedRecipes: recipe._id },
    });

    res.json({ msg: "Recipe liked", likes: recipe.likesCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save recipe
router.post("/save/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedRecipes: req.params.id },
    });
    res.json({ msg: "Recipe saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
