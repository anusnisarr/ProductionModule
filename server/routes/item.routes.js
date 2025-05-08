import express from 'express';
import path from 'path';
import { createNewItem, getAllItems, getItemById, editCategory, deleteCategory } from '../controllers/item.controller.js';
import { fileURLToPath } from "url";
import { upload } from '../middlewares/muter.middlewares.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public", "item.html"));
})

router.get("/api", getAllItems)

router.get("/Create", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public", "createItem.html"));
})

router.post("/Create", upload.single("itemImage") , createNewItem)

router.get("/Edit/:itemId", (req, res) => {
    res.sendFile(path.join(__dirname, "../Public", "createItem.html"));
})
router.get("/api/:itemId", getItemById);

router.put("/Edit/:itemId", upload.single("itemImage") , editCategory);

router.delete("/Delete/:itemCode", deleteCategory)




export default router;