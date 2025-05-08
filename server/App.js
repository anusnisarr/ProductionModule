import express from "express";
import mongoose from "mongoose";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
import recipeRoutes from "./routes/recipe.routes.js"
import demandRoutes from "./routes/demand.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static(path.join(__dirname , "Public")));
app.use(express.static(".")); 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.get("/" , (req , res)=>{
    res.sendFile(path.join(__dirname , "Public" , "index.html"));
})

//HANDLE ALL CATEGORY ROUTES USING categoryRoutes.js
app.use("/categories", categoryRoutes);

app.use("/items" , itemRoutes);

app.use("/recipe" , recipeRoutes);

app.use("/demand" , demandRoutes);

app.get("/SaleHistory" , (req , res)=>{
    res.sendFile(path.join(__dirname , "Public" , "saleHistory.html"));
})

app.get("/Setup" , (req , res)=>{
    res.sendFile(path.join(__dirname , "Public" , "setup.html"));
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ Database Error", err));

app.listen(process.env.PORT , (req , res)=>{
    console.log("working...");
});