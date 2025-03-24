import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

  // Configuration
  cloudinary.config({ 
    cloud_name: 'dmdiswjf8', 
    api_key: '965639792315753', 
    api_secret: 'lrlvO3e6Iq8MDytTiK_EQu3x5lM' // Click 'View API Keys' above to copy your API secret
  });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(process.cwd(),'/uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage });


  // Upload an image
  const uploadToCloudinary =async(file:any) => {
   const result = await cloudinary.uploader.upload(
      file.path, {
          public_id: file.originalname,
      }
  ).catch((error) => {
      console.log(error);
  });

   fs.unlinkSync(file.path); // Delete the file after upload
   return result;

  }

  export const fileUploader={
    upload,
    uploadToCloudinary
  }