import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'    
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        
        if(!localFilePath) return null
        const cresponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        //file upload successfuly
        // console.log('file successfully upload',cresponse)
        fs.unlinkSync(localFilePath)
        return cresponse
    }
    catch(err){
        console.log(err)
        fs.unlinkSync(localFilePath)
        return null
    }

    
}

export {uploadOnCloudinary}
