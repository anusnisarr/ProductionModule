import express from 'express';
import multer from 'multer';
import { uploadFile, createNewItem, getAllItems, getItemById, editCategory, deleteCategory } from '../controllers/item.controller.js';
import { upload } from '../middlewares/muter.middlewares.js';


const router = express.Router();

router.get("/api", getAllItems)

router.post("/Create", upload.single("itemImage") , createNewItem)

router.post('/upload', upload.single('file'), uploadFile);

router.get("/api/:itemId", getItemById);

router.put("/Edit/:itemId", upload.single("itemImage") , editCategory);

router.delete("/Delete/:itemCode", deleteCategory)

export default router;