import mongoose from 'mongoose';

const ItemSchema = mongoose.Schema({
    itemId : {type : Number},
    itemName : {type : String},
    itemCode : {type : String},
    itemPrice : {type : Number},
    categoryName : {type : String},
    categoryCode : {type : String},
    itemType : {type : String},
    itemImageURL : {type : String},
    isActive : {type : Boolean}
});

export default mongoose.model("Item", ItemSchema);