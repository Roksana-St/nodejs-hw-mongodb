import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config(); 

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    const response = await cloudinary.v2.uploader.upload(file.path);
    await fs.unlink(file.path);
    return response.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error('File upload to Cloudinary failed');
  }
};


