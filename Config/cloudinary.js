const cloudinary  = require("cloudinary").v2;

//*This is the function to invoke to make connection to the cloudinary
exports.cloudinaryConnect = ()=>{
    try {
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })
       

    } catch (error) {
        //Incase of the error console log the error 
        console.log(error);
    }
}