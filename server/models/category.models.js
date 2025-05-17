import mongoose from 'mongoose';


const CategorySchema = mongoose.Schema({
    categoryId:{type: Number},
    categoryName:{type: String , required: true},
    categoryCode:{ type: String, required: [true, "Category code is required"], unique: true },
    categoryColor: {type: String},
    IsActive : {type : Boolean}
    },
    { timestamps: true }
)

export default mongoose.model("Category", CategorySchema);