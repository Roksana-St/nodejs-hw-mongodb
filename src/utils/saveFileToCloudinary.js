import cloudinary from 'cloudinary';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


export const saveFileToCloudinary = async (file) => {
  try {
    const filePath = path.resolve(file.path); 
     console.log('File path:', filePath);
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'contacts',
      resource_type: 'image',
    });
    return result.secure_url; 
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error.message);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
