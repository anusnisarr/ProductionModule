

import mongoose from 'mongoose';

const RecipeSchema = mongoose.Schema({
    recipeId : {type : Number},
    recipeCode : {type : String},
    recipeName : {type : String},
    recipeType : {type : String},
    description : {type : String},
    recipeCost : {type : Number},
    Status: {type : Boolean},

    ingredients: [
        {
            itemId: { type: Number },
            itemCode: { type: String },
            itemName: { type: String },
            itemType: { type: String },
            quantity: { type: Number },
            rate: { type: Number },
            wastage: { type: Number },
            totalAmount: { type: Number },
            unit: { type: String }

        }
    ],
});

export default mongoose.model("Recipe", RecipeSchema);