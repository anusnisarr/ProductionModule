
import Recipe from "../models/recipe.models.js"; // Assuming you have a Recipe model

let recipeId = null

//TO GET NEXT Recipe ID
const recipeIdCount = async () => {
    const recipes = await Recipe.find();
    let recipeIdArray = [];

    //SAVE THE MAXIMUM Recipe ID IN recipeId VARIABLE
    recipes.forEach((Recipe) => {
        recipeIdArray.push(Recipe.recipeId);
    });

    if(recipeIdArray.length === 0) { recipeId = 1; return; }

    recipeId = Math.max(...recipeIdArray) + 1;
    
}

//API CALL TO SEND ALL Recipe DATA TO FRONTEND TO SHOW IN TABLE
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all categories from DB
        res.status(200).json(recipes); // Send as JSON response
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//CREATE Recipe IN DATABASE WHEN CLICK ON SAVE BUTTON
const createRecipe = async (req, res) => {
    
    try {
        const { recipeName, recipeCode , description , recipeType , recipeCost , Status} = req.body.recipe;
        const {ingredients} = req.body.recipe;
        console.log(recipeCost);
        

        if (!ingredients.length || !recipeCode) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if Recipe code already exists
        const existingrecipe = await Recipe.findOne({ recipeCode });

        if (existingrecipe) {
            return res.status(400).json({ message: "Recipe code already exists!" });
        }

        await recipeIdCount();        
        const newrecipe = new Recipe({
            recipeId,
            recipeCode,
            recipeName,
            recipeType,
            recipeCost,
            Status: Status === "Active" ? true : false,
            description,
            ingredients
        });

        await newrecipe.save();

        return res.status(201).json({ message: "Recipe created successfully!" });

    } catch (error) {
        console.error("Error creating Recipe:", error);
        return res.status(500).json({ message: "Internal server error" , error});
    }
};

//API CALL TO SEND Recipe DATA TO FRONTEND
const getRecipeByCode = async (req, res) => {
    try {
        const { recipeCode } = req.params;

        const response = await Recipe.findOne({ recipeCode: recipeCode });

        if (!response) {
            // If Recipe not found, send 404
            return res.status(404).json({ message: "Recipe not found" });
        }
            // If Recipe found, send Recipe
            res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching Recipe:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE Recipe IN DATABASE WHEN CLICK ON SAVE BUTTON
const editRecipe = async (req, res) => {        
    try {
        const { recipeName } = req.body;
        const { recipeCode } = req.params;
        const { Status } = req.body;
        const { ingredients } = req.body;
        const { recipeType } = req.body;
        const { recipeCost } = req.body;
        const { description } = req.body;
        const { recipeId } = req.body;

        console.log(req.body);
        

        
        const updatedrecipe = await Recipe.findOneAndUpdate(
            { recipeCode: recipeCode }, // Find Recipe by code
            { recipeName: recipeName , ingredients: ingredients , IsActive : Status === "Active" ? true : false,
            recipeType:recipeType,recipeCost:recipeCost,description:description,recipeId:recipeId}, // Update with new data
            { new: true } // Return updated document
        );
        
        if (!updatedrecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(201).json({ message: "Recipe updated successfully!" });

        } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE Recipe IN DATABASE WHEN CLICK ON SAVE BUTTON
const deleteRecipe = async (req, res) => {        
    const { recipeCode } = req.params;

    try {
        const deletedrecipe = await Recipe.findOneAndDelete({ recipeCode: recipeCode })

            console.log(deletedrecipe);
            
        
        if (!deletedrecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.status(201).json({ message: "Recipe deleted successfully!" });
    } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export { getAllRecipes, createRecipe, editRecipe, getRecipeByCode, deleteRecipe };
