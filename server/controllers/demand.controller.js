import Demand from "../models/Demand.models.js"; // Assuming you have a Demand model
import Item from "../models/item.models.js";

let demandNo = null

//TO GET NEXT Demand ID
const demandIdCount = async () => {
    const demands = await Demand.find();
    let demandIdArray = [];

    //SAVE THE MAXIMUM Demand ID IN demandNo VARIABLE
    demands.forEach((Demand) => {
        demandIdArray.push(Demand.demandNo);
    });

    if(demandIdArray.length === 0) { demandNo = 1; return; }

    return demandNo = Math.max(...demandIdArray) + 1;
    
}

//API CALL TO SEND ALL Demand DATA TO FRONTEND TO SHOW IN TABLE
const getAllDemands = async (req, res) => {
    try {
        const demands = await Demand.find(); // Fetch all categories from DB
        res.status(200).json(demands); // Send as JSON response
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//CREATE Demand IN DATABASE WHEN CLICK ON SAVE BUTTON
const createDemand = async (req, res) => {
        
    try {
        const { demandNo, userName , demandDate , noOfItems ,totalQuantity , deliveryDate} = req.body.updatedFormData;
        const { items } = req.body.updatedFormData;
        console.log(demandNo);
        

        if (!items || !demandNo) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if Demand code already exists
        const existingdemand = await Demand.findOne({ demandNo });

        if (existingdemand) {
            return res.status(400).json({ message: "demandNo already exists!" });
        }

        const newdemand = new Demand({
            demandNo,
            userName,
            demandDate,
            totalQuantity,
            noOfItems,
            deliveryDate,
            items
        });

        await newdemand.save();

        return res.status(201).json({ message: "Demand created successfully!" });

    } catch (error) {
        console.error("Error creating Demand:", error);
        return res.status(500).json({ message: "Internal server error" , error});
    }
};

//API CALL TO SEND Demand DATA TO FRONTEND
const getDemandByNo = async (req, res) => {
    try {
        const { demandNo } = req.params;
        console.log(demandNo);

        const Demand = await Demand.findOne({ demandNo: demandNo });

        if (!Demand) {
            // If Demand not found, send 404
            return res.status(404).json({ message: "Demand not found" });
        }

        // If Demand found, send Demand
        res.status(200).json(Demand);
    } catch (error) {
        console.error("Error fetching Demand:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE Demand IN DATABASE WHEN CLICK ON SAVE BUTTON
const editDemand = async (req, res) => {        
    try {
        const { demandName } = req.body;
        const { demandCode } = req.params;
        const { demandColor } = req.body;
        const { demandStatus } = req.body;
        
        const updateddemand = await Demand.findOneAndUpdate(
            { demandCode: demandCode }, // Find Demand by code
            { demandName: demandName , demandColor: demandColor , IsActive : demandStatus === "Active" ? true : false
             }, // Update with new data
            { new: true } // Return updated document
        );
        
        if (!updateddemand) {
            return res.status(404).json({ message: "Demand not found" });
        }

        res.status(201).json({ message: "Demand updated successfully!" });

        } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

//UPDATE Demand IN DATABASE WHEN CLICK ON SAVE BUTTON
const deleteDemand = async (req, res) => {        
    const { demandNo } = req.params;

    try {
        const deleteddemand = await Demand.findOneAndDelete({ demandNo: demandNo })

            console.log(deleteddemand);
            
        
        if (!deleteddemand) {
            return res.status(404).json({ message: "Demand not found" });
        }

        res.status(201).json({ message: "Demand deleted successfully!" });
    } 
    
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export {createDemand ,  getAllDemands, demandIdCount, editDemand, getDemandByNo, deleteDemand };
