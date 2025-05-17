import multer from "multer";
import path from "path";
<<<<<<< HEAD
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
=======

// Fix __dirname in ES6 Modules (if you're using ES modules)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

export const upload = multer({
>>>>>>> master
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });