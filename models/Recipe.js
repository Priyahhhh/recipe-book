import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  steps: [String],
  likesCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
