import Category from "../models/category.models.js"; // Assuming you have a Category model
import Item from "../models/item.models.js";

let categoryId = null

//TO GET NEXT CATEGORY ID
const categoryIdCount = async () => {
    const categories = await Category.find();
    let categoryIdArray = [];

    //SAVE THE MAXIMUM CATEGORY ID IN categoryId VARIABLE
    categories.forEach((category) => {
        categoryIdArray.push(category.categoryId);
    });

    if(categoryIdArray.length === 0) { categoryId = 1; return; }

    categoryId = Math.max(...categoryIdArray) + 1;
    
}

//API CALL TO SEND ALL CATEGORY DATA TO FRONTEND TO SHOW IN TABLE
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories from DB
        res.status(200).json(categories); // Send as JSON response
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//CREATE CATEGORY IN DATABASE WHEN CLICK ON SAVE BUTTON
const createCategory = async (req, res) => {
    
    try {
        const { categoryName, categoryCode , categoryColor , categoryStatus} = req.body;
        
        if (!categoryName || !categoryCode) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if category code already exists
        const existingCategory = await Category.findOne({ categoryCode });

        if (existingCategory) {
            return res.status(400).json({ message: "Category code already exists!" });
        }

        await categoryIdCount();        
        const newCategory = new Category({
            categoryId,
            categoryName,
            categoryCode,
            categoryColor,
            IsActive : categoryStatus === "Active" ? true : false
        });

        await newCategory.save();

        return res.status(201).json({ message: "Category created successfully!" });

    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Internal server error" , error});
    }
};

//API CALL TO SEND CATEGORY DATA TO FRONTEND
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findOne({ categoryId: categoryId });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE CATEGORY IN DATABASE WHEN CLICK ON SAVE BUTTON
const editCategory = async (req, res) => {        
    try {
        const { categoryName } = req.body;
        const { categoryCode } = req.params;
        const { categoryColor } = req.body;
        const { categoryStatus } = req.body;
        
        const updatedCategory = await Category.findOneAndUpdate(
            { categoryCode: categoryCode }, // Find category by code
            { categoryName: categoryName , categoryColor: categoryColor , IsActive : categoryStatus === "Active" ? true : false
             }, // Update with new data
            { new: true } // Return updated document
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(201).json({ message: "Category updated successfully!" });

        } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE CATEGORY IN DATABASE WHEN CLICK ON SAVE BUTTON
const deleteCategory = async (req, res) => {        
    const { categoryCode } = req.params;

   const isItemExist =  await Item.findOne({categoryCode : categoryCode})

   if (isItemExist) {
    return res.status(404).json({ message: "Items exist in this category" });
   }

    try {
        const deletedCategory = await Category.findOneAndDelete({ categoryCode: categoryCode })

            console.log(deletedCategory);
            
        
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(201).json({ message: "Category deleted successfully!" });
    } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
export { getAllCategories, createCategory, editCategory, getCategoryById, deleteCategory };
