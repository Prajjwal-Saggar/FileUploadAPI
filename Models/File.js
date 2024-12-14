const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

fileSchema.post("save", async function (docs) {
  try {
    //Transporter Create
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info  = await transporter.sendMail({
      from:`Prajjwal Saggar`,
      to:docs.email,
     subject: "📁 Your File Has Been Successfully Uploaded!",
html: `
  <h2>Hello!</h2>
  <p>We're excited to let you know that your file has been uploaded successfully. 🎉</p>
  <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
  <br>
  <p>Best regards,<br>Your Company Team</p>
`
    })
  } catch (error) {
    console.error(error);
  }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
