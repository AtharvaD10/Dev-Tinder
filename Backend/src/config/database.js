const mongoose = require("mongoose");


const connectDB = async()=>{
   await mongoose.connect(
    "mongodb+srv://Atharva:FzrNpqAG7cOMR2o9@namaste-node.ktjf5.mongodb.net/devTinder");
};

module.exports = connectDB;