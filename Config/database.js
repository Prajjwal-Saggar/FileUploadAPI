const mongoose  = require("mongoose");

require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(console.log("DB connected Successful"))
    .catch((error)=>{
        console.log("DB connnection Issues");
        console.log(error);
        process.exit(1);
    })
}