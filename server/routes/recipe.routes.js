import express from 'express';
import path from 'path';
import { getAllRecipes, createRecipe, editRecipe, getRecipeByCode, deleteRecipe } from '../controllers/recipe.controller.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ROUTE TO HANDLE API CALL TO GET ALL CATEGORY DATA
router.get("/api/recipe", getAllRecipes);

// ROUTE TO HANDLE API CALL TO CREATE NEW CATEGORY
router.post("/Create", createRecipe);

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.get("/api/recipe/:recipeCode", getRecipeByCode);

// ROUTE TO HANDLE API CALL TO UPDATE NEW CATEGORY
router.put("/Edit/:recipeCode", editRecipe)

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.delete("/api/recipe/delete/:recipeCode", deleteRecipe);


export default router;