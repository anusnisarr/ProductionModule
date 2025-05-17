import multer from "multer";
import path from "path";

// Fix __dirname in ES6 Modules (if you're using ES modules)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
  });