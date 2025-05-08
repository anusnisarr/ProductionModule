import mongoose from 'mongoose';

const DemandSchema = mongoose.Schema({
    demandNo : {type : String},
    userName : {type : String},
    demandDate : {type : String},
    totalQuantity: { type: Number },
    noOfItems: { type: Number },
    deliveryDate : {type : String},
    items : [
        {
        itemName: { type: String },
        itemCode: { type: String },
        itemType: { type: String },
        itemId: { type: Number },
        quantity: { type: Number },
        unitPrice: { type: Number }
        }
    ],
});

export default mongoose.model("Demand", DemandSchema);