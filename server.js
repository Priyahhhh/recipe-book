import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/recipebook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Schema & Model
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  likes: { type: Number, default: 0 },
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// --- API Routes ---

// Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search recipes
app.get("/api/recipes/search/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const recipes = await Recipe.find({
      title: { $regex: name, $options: "i" },
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Serve Frontend (index.html from public/) ---
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
