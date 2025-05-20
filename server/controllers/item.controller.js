import { uploadFileToCloudinary } from "../utils/cloudinaryUpload.js";
import Item from "../models/item.models.js";
import Category from  "../models/category.models.js";
import dotenv from "dotenv";
import fs from "fs";
import XLSX from 'xlsx';
import mongoose from 'mongoose';
dotenv.config();
let itemIdAssign = null;

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find(); // Fetch all categories from DB
        res.status(200).json(items); // Send as JSON response
    } catch (error) {
        console.error("❌ Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//API CALL TO SEND CATEGORY DATA TO FRONTEND
const getItemById = async (req, res) => {
    try {
        const itemId = Number(req.params.itemId); // Ensure it's a number

        const Gotitem = await Item.findOne({ itemId: itemId });
        
        if (!Gotitem) {
            return res.status(404).json({ message: "Item not found" });
        }
             return res.status(200).json(Gotitem);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const itemIdCount = async () => {
    const items = await Item.find();
    let itemIdArray = [];

    items.forEach((Item) => {
        itemIdArray.push(Item.itemId);
    });
    
    if(itemIdArray.length === 0) { itemIdAssign = 1; return; }
    itemIdAssign = Math.max(...itemIdArray) + 1;
    
}

// Create and Save a new Item
const createNewItem = async (req, res) => {     
    await itemIdCount() 

    try {
        const {itemName, itemCode, itemPrice , categoryCode , itemType , categoryName , isActive} = req.body        

        if (!itemName || !itemCode || !itemPrice || !categoryCode) {
            res.status(400).send({
                message: "Please fill out all fields correctly."
            });
            return;
        }

        let itemImageURL;
        
        if (req.file) {
            const response = await uploadFileToCloudinary(req.file.path , itemName);
            itemImageURL = response.url;
        }

        const existingitemCode = await Item.findOne({ itemCode });
        
        if (existingitemCode) {
            return res.status(400).json({ message: "Item Code already exists!" });
        }   
        
        // Create a Item
        const newItem = new Item({
            itemId : await itemIdAssign,
            itemName,
            itemCode,
            itemPrice,
            categoryCode,
            categoryName,
            itemImageURL,
            itemType,
            isActive: isActive === "Active" ? true : false
        })
        await newItem.save()
        
        //console the Item saved in db
        console.log(newItem);
        
        // Unlink the file from the local storage
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {console.error("Error deleting file:", err)};
            });
        }

        return res.send({message: "Item created successfully!" , data: newItem});

        } catch (error) {
        res.status(500).send({ 
            error: error.message || "Some error occurred while creating the Item."
        });

        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {console.error("Error deleting file:", err)};
            });
        }
    }
   
};

//  UPLOAD ITEM THROUGH EXCEL FILE IMPORT 

const uploadFile = async (req, res) => {
    const filePath = req.file.path;
    
    try {
        // Read the workbook
        const workbook = XLSX.readFile(filePath);

        // Read first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        console.log("SheetData", jsonData);
        
        const session = await mongoose.startSession();
        
        try {

            session.startTransaction();
            
            // Validate all items before insertion
            for (const item of jsonData) {
                
                const exists = await Item.findOne({ itemCode: item.ItemCode }).session(session);
                if (exists) {
                    throw new Error(`Item Code: ${item.ItemCode} Already Exists!`);
                }
                
                const categoryData = await Category.findOne({ categoryName: item.Category }).session(session);
                if (!categoryData) {
                    throw new Error(`Category: ${item.Category} not found!`);
                }
            }
            
            const newItems = [];
            
            for (const item of jsonData) {
                await itemIdCount();
                
                const categoryData = await Category.findOne({ categoryName: item.Category }).session(session);
                
                const newItem = new Item({
                    itemId: await itemIdAssign,
                    itemName: item.ItemName,
                    itemCode: item.ItemCode,
                    itemPrice: item.ItemPrice,
                    categoryCode: categoryData.categoryCode,
                    categoryName: item.Category,
                    itemImageURL: null,
                    itemType: item.ItemType,
                    isActive: item.Status.toLowerCase() === "active" ? true : false
                });
                
                await newItem.save({ session });
                newItems.push(newItem);
            }
            
            // Commit the transaction if everything is successful
            await session.commitTransaction();
            session.endSession();
            
            fs.unlinkSync(filePath);
            
            return res.status(200).json({ success: true, data: jsonData });
            
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error; 
        }
        
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        console.log(error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || String(error),
            error: 'Error processing file' 
        });
    }
};

 //UPDATE CATEGORY IN DATABASE WHEN CLICK ON SAVE BUTTON
 const editCategory = async (req, res) => {            
    try {
        const itemId = Number(req.params.itemId);
         const { itemName } = req.body;
         const { itemPrice } = req.body;
         const { categoryCode } = req.body;
         const { categoryName } = req.body;
         const { isActive } = req.body;
         const {itemType}   = req.body;
         
         let itemImageURL;
        
         if (req.file) {
            const  response = await uploadFileToCloudinary(req.file.path)
            itemImageURL = response.url            
        }

         if (!itemName) {
            res.status(400).send({
                message: "Item name is required."
            });
            return;
        }

        if (!itemPrice) {
            res.status(400).send({
                message: "Item price is required."
            });
            return;
        }

        if (!categoryCode) {
            res.status(400).send({
                message: "Category code is required."
            });
            return;
        }

        if (!categoryName) {
            res.status(400).send({
                message: "Category name is required."
            });
            return;
        }

        if (!itemId) {
            res.status(400).send({
                message: "Item ID is required."
            });
            return;
        }
        
         const updatedItems = await Item.findOneAndUpdate(
             { itemId: itemId}, // Find category by id
             { itemName: itemName , itemPrice : itemPrice , categoryName :categoryName , categoryCode: categoryCode ,itemType : itemType ,  itemImageURL : itemImageURL , isActive : isActive === "Active"? true : false}, // Update with new data
             { new: true } // Return updated document
         );
         
         if (!updatedItems) {
             return res.status(404).json({ message: "Item not found" });
         }
 
         return res.status(201).json({ message: "Item updated successfully!" , data : updatedItems });
     } 
     
     catch (error) {
        return res.status(500).json({ error: "Server error" });
     }
};

 const deleteCategory = async (req , res) => {
    try {
        const { itemCode }= req.params
        
        const response = await Item.findOneAndDelete({itemCode})
        
        if (!response) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(201).json({ message: "Item deleted successfully!" });
    } catch (error) {
        console.error("Error: " , error || "Server Error")
    }
}
 
export {uploadFile, createNewItem, getAllItems, getItemById, editCategory, deleteCategory };
