import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES6 Modules (if you're using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const uploadPath = path.join(__dirname, "../Public/images/tempItemImages");
    cb(null, uploadPath);
  },
  filename: function (_req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Multer" , file);
    
    cb(null, uniqueName);
  }
});
  
  export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });