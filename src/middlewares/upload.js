import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    
    // Логування шляху
    console.log('Шлях до директорії для завантаження:', uploadPath);

    // Перевірка доступу до директорії
    fs.access(uploadPath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
      if (err) {
        console.error('Директорія недоступна для запису:', uploadPath);
        cb(new Error('Директорія недоступна для запису'));
      } else {
        console.log('Директорія доступна для запису:', uploadPath);
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); 
  },
});

export const upload = multer({ storage });
