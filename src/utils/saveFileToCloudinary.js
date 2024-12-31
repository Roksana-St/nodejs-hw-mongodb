import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  const result = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'contacts', 
    resource_type: 'image',
  });
  return result.secure_url; 
};



