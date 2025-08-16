import fs from 'fs';
import multer from 'multer';
import path from 'path';

const uploadPath = path.join(process.cwd(), 'Uploads'); // Absolute path to 'Uploads' folder

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if 'Uploads' folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Automatically creates the folder
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use timestamp to prevent name clash
  }
});

export const upload = multer({ storage });
