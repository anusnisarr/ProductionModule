import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs"

const uploadFileToCloudinary = async (localFilePath , itemName) => {
    if (!localFilePath) return null
    try {
        const uploadResponse = await cloudinary.uploader
            .upload(localFilePath, {
                resouece_type : "image",
                public_id: itemName,
                overwrite: true
            })
            console.log("Upload Success:", uploadResponse.url);
            return uploadResponse
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the local saved file
        console.error("Upload Error:", error);
        return null
    }
}

export {uploadFileToCloudinary}
