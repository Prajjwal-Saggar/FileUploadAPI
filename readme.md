# 📁 File Upload App

A powerful and scalable **File Upload App** built with Node.js, Express, MongoDB, and Cloudinary. This application allows users to upload files, images, and videos, process them efficiently, and store them locally or on Cloudinary. 🚀

---

## 📜 Table of Contents
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation and Usage](#-installation-and-usage)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [How It Works](#-how-it-works)
- [Code Breakdown](#-code-breakdown)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

- Upload files locally or directly to Cloudinary.
- Automatic file validation and error handling.
- Reduce image size and quality before uploading.
- Notify users via email upon successful uploads.
- Well-structured and modular codebase for scalability.

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **File Handling**: express-fileupload
- **Cloud Storage**: Cloudinary
- **Email Notifications**: Nodemailer
- **Environment Variables**: dotenv

---

## 🗂️ Project Structure

```plaintext
File Upload App
├── Config
│   ├── cloudinary.js    # Cloudinary connection setup
│   └── database.js      # MongoDB connection setup
├── Controllers
│   └── fileUpload.js    # Core file upload logic
├── Models
│   └── File.js          # File schema and post-save email notifications
├── Routes
│   └── fileUpload.js    # API routes for file upload
├── Node Modules          # Installed dependencies
├── .env                  # Environment variables
├── index.js              # Main server entry point
└── README.md             # Project documentation
```

---

## 🚀 Installation and Usage

### 1. Clone the Repository
```bash
$ git clone <repository-url>
$ cd File-Upload-App
```

### 2. Install Dependencies
```bash
$ npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
PORT=4001
MONGO_URL=<your-mongodb-url>
CLOUD_NAME=<your-cloudinary-cloud-name>
API_KEY=<your-cloudinary-api-key>
API_SECRET=<your-cloudinary-api-secret>
MAIL_HOST=<your-smtp-host>
MAIL_USER=<your-smtp-user>
MAIL_PASS=<your-smtp-password>
```

### 4. Start the Server
```bash
$ npm start
```
The server will run on `http://localhost:4001`.

---

## 🌐 API Endpoints

### Base URL: `http://localhost:4001/api/v1/upload`

| Endpoint               | Method | Description                                  |
|------------------------|--------|----------------------------------------------|
| `/localFileUpload`     | POST   | Upload a file locally.                      |
| `/imageUpload`         | POST   | Upload an image to Cloudinary.              |
| `/videoUpload`         | POST   | Upload a video to Cloudinary.               |
| `/imageSizeReducer`    | POST   | Upload and reduce image size on Cloudinary. |

### Example Request
#### Image Upload
```http
POST /api/v1/upload/imageUpload
Content-Type: multipart/form-data

{
  "name": "Sample Image",
  "tags": "test, sample",
  "email": "example@example.com",
  "imageUrl": <file>
}
```

#### Response
```json
{
  "success": true,
  "message": "The file uploaded successfully"
}
```

---

## 🔍 How It Works

### **1. Local File Upload**
- The file is fetched from the request using `req.files`.
- Stored temporarily on the server using the `mv()` method.

### **2. Cloudinary Upload**
- The file is uploaded directly to a specified folder in Cloudinary.
- Cloudinary generates a secure URL, which is saved in the database.

### **3. Email Notifications**
- Once a file is uploaded successfully, a confirmation email is sent to the user using Nodemailer.

---

## 📂 Code Breakdown

### **1. Config/cloudinary.js**
```javascript
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

module.exports = cloudinary;
```
#### Explanation
- Configures Cloudinary using environment variables.
- Exports the configured `cloudinary` instance for use in other files.

### **2. Config/database.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```
#### Explanation
- Establishes a connection to the MongoDB database using Mongoose.
- Exits the application if the connection fails.

### **3. Models/File.js**
```javascript
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const fileSchema = new mongoose.Schema({
  name: String,
  url: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

fileSchema.post('save', async function (doc) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: doc.email,
    subject: 'File Uploaded Successfully',
    text: `Your file ${doc.name} has been uploaded successfully.`,
  });
});

module.exports = mongoose.model('File', fileSchema);
```
#### Explanation
- Defines a schema for files with fields for name, URL, email, and creation date.
- Sends an email notification after a file is saved to the database.

### **4. Controllers/fileUpload.js**
```javascript
const cloudinary = require('../Config/cloudinary');
const File = require('../Models/File');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.files.image;
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'uploads',
    });

    const newFile = await File.create({
      name: file.name,
      url: uploadResponse.secure_url,
      email: req.body.email,
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: newFile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```
#### Explanation
- Handles image upload requests.
- Uploads the image to Cloudinary and saves the file details in MongoDB.

### **5. Routes/fileUpload.js**
```javascript
const express = require('express');
const router = express.Router();
const { uploadImage } = require('../Controllers/fileUpload');
const fileUpload = require('express-fileupload');

router.use(fileUpload({ useTempFiles: true }));

router.post('/imageUpload', uploadImage);

module.exports = router;
```
#### Explanation
- Sets up a route for handling image uploads.
- Uses `express-fileupload` middleware to handle file uploads.

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request. 🎉

---

## 📄 License

This project is licensed under the MIT License. Copyright (c) 2024 Prajjwal Saggar

---

### ✨ Happy Coding! 😄
