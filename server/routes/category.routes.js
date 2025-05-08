import express from 'express';
import path from 'path';
import { getAllCategories, createCategory, editCategory, getCategoryById, deleteCategory } from '../controllers/category.controller.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

//MAIN ROUTE TO SERVE CATEGORY.HTML
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public", "category.html"));
});

// ROUTE TO HANDLE API CALL TO GET ALL CATEGORY DATA
router.get("/api/categories", getAllCategories);

//MAIN ROUTE TO SERVE CREATECATEGORY.HTML
router.get("/Create", (req , res) => {
    res.sendFile(path.join(__dirname , "../Public" , "CreateCategory.html"));
})

// ROUTE TO HANDLE API CALL TO CREATE NEW CATEGORY
router.post("/Create", createCategory);

//MAIN ROUTE TO SERVE EDITCATEGORY.HTML
router.get("/Edit/:categoryCode", (req , res) => {
    res.sendFile(path.join(__dirname , "../Public" , "CreateCategory.html"))
})

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.get("/api/categories/:categoryId", getCategoryById);

// ROUTE TO HANDLE API CALL TO UPDATE NEW CATEGORY
router.put("/Edit/:categoryCode", editCategory)

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.delete("/api/categories/delete/:categoryCode", deleteCategory);


export default router;