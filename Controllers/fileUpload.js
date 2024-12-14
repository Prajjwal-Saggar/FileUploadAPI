require("dotenv").config();
const File = require("../Models/File");
const cloudinary = require("cloudinary").v2;

//localFileUpload -->Handler Function

exports.localFileUpload = async (req, res) => {
  try {
    //!fetch the file using the hierarcy  given below
    const file = req.files.file;
    console.log("File-->", file);
    //Create path where file needs to be stored
    let path =
      __dirname + "/files" + Date.now() + "." + `${file.name.split(".")[1]}`; //__dirname shows the current working directory and in this given case the current working directory is the controller
    file.mv(path, (err) => {
      //*This moves to the path and the path is the path of the server
      console.log(err);
    });
    res.status(201).json({
      success: true,
      message: "The FIle uplaod is done successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//*imageUpload

//Function for file type validation

function isFileValidType(type, supportedTypes) {
  return supportedTypes.includes(type);
}

//^Function to upload file to the cloud
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder  ,  resource_type: "auto"};
  if(quality){
    options.quality = quality; 
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
  try {
    //fetcching the normal details
    const { name, tags, email } = req.body;

    //fetching the image file
    const file = req.files.imageUrl;
    const fileType = file.name.split(".")[1].toLowerCase();
    //!  Validation
    const supported = ["jpeg", "jpg", "png"];

    if (!isFileValidType(fileType, supported)) {
      res.status(401).json({
        success: false,
        message: "The file type is invalid",
      });
    }
    const response = await uploadFileToCloudinary(file, "Saggar",30 );
    console.log(response);

    //make entry to the Db

    const fileData = await File.create({
      name,
      imageUrl: response.secure_url,
      tags,
      email,
    });
    res.status(201).json({
      success: true,
      message: "The file uploaded successfully",
    });

    console.log(fileData);
  } catch (error) {
    console.error(error);
  }
};

//Writing the code for the VideoUpload Route 

exports.videoUpload = async(req,res) =>{
  try {
      //fetcching the normal details
      const { name, tags, email } = req.body;

      //fetching the image file
      const file = req.files.videoUrl;
      const fileType = file.name.split(".")[1].toLowerCase();
      //!  Validation
      const supported = ["mp4" , "mov"];
     //The file must be less than 5MB of Size 
      if (!isFileValidType(fileType, supported)) {
        res.status(401).json({
          success: false,
          message: "The file type is invalid",
        });
      }
      const response = await uploadFileToCloudinary(file, "Saggar");
      console.log(response);
  
      //make entry to the Db
  
      const fileData = await File.create({
        name,
        imageUrl: response.secure_url,
        tags,
        email,
      });
      res.status(201).json({
        success: true,
        message: "The file uploaded successfully",
      });
  
      console.log(fileData);
  } catch (error) {
    console.error(error);
  }
}


//imageSizeReducer

exports.imageSizeReducer = async (req,res) =>{
  try {
    //fetching normal details
    const { name, tags, email } = req.body;
        console.log("The name is --->" , name  , tags  ,  email)
    //fetching the image file
    const file = req.files.imageUrl;
    const fileType = file.name.split(".")[1].toLowerCase();
    //!  Validation
    const supported = ["jpeg", "jpg", "png"];

    if (!isFileValidType(fileType, supported)) {
      res.status(401).json({
        success: false,
        message: "The file type is invalid",
      });
    }
    const response = await uploadFileToCloudinary(file, "Saggar",30);
    console.log(response);

    //make entry to the Db

    const fileData = await File.create({
      name,
      imageUrl: response.secure_url,
      tags,
      email,
    });
    res.status(201).json({
      success: true,
      message: "The file uploaded successfully",
    });

    console.log(fileData);
  } catch (error) {
    console.error(error);
  }
}