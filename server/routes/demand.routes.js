import express from 'express';
import path from 'path';
import { getAllDemands, createDemand, editDemand, getDemandByNo, deleteDemand } from '../controllers/demand.controller.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ROUTE TO HANDLE API CALL TO GET ALL CATEGORY DATA
router.get("/api/demand", getAllDemands);

// ROUTE TO HANDLE API CALL TO CREATE NEW CATEGORY
router.post("/Create", createDemand);

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.get("/api/demand/:demandCode", getDemandByNo);

// ROUTE TO HANDLE API CALL TO UPDATE NEW CATEGORY
router.put("/Edit/:demandCode", editDemand)

// ROUTE TO HANDLE API CALL TO GET EDITED CATEGORY DATA BY PARAMS CODE
router.delete("/api/demand/delete/:demandNo", deleteDemand);


export default router;