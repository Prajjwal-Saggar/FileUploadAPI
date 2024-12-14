const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4001;

//^This is the middleware to parse the or collect and  send the json data for example the form data  and stuff
app.use(express.json());

//*Here we will use the middleware for file handling basically the express package named express-FileUpload or the multer can also be used
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
); //Ye(file upload ) tumhara server pe load karta hai or cloudinary vala pehle server pe load karta hai fir usse media server pe load karta hai fir usse server se delete kar deta hai

//db connect
const db = require("./Config/database");
db.connect();
//cloud se connect karna
const cloudinary = require("./Config/cloudinary");
cloudinary.cloudinaryConnect();

//api route mounting
const Upload = require("./Routes/fileUpload");
app.use("/api/v1/upload", Upload);

//Start the APP

app.listen(PORT, () => {
  console.log(`The server is running at the ${PORT}`);
});

//!Local File Upload mein DB se interaction 0 hai to koi entry nhi create hogi DB mein
