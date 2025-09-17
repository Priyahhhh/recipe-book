import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
});

const User = mongoose.model("User", userSchema);
export default User;
