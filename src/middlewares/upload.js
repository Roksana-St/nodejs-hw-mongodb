import fs from 'fs';
import path from 'path';
import multer from 'multer';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');

    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('Директорія не існує, створюємо...');
        fs.mkdirSync(uploadPath);  
      }

      fs.access(uploadPath, fs.constants.W_OK, (err) => {
        if (err) {
          console.error('Директорія недоступна для запису:', uploadPath);
          cb(new Error('Директорія недоступна для запису'));
        } else {
          console.log('Директорія доступна для запису:', uploadPath);
          cb(null, uploadPath);
        }
      });
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); 
  },
});

export const upload = multer({ storage });