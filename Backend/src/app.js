const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();

app.post("/signup",async (req,res)=>{
  const user = new User({
        firstName : "Atharva",
        lastName : "Deshpande",
        emailId : "deshpandeatharva10@gmail.com",
        password : "deshpande@123"
    });
  
    try{
        await user.save();
        res.send("User added sucessfully...");
    }catch(err){
        res.status(400).send("Error :"+err.message);
    }
  
    
});

connectDB()
        .then(()=>{
            console.log("Database Connection Sucessfully...");
            app.listen(7777, () => {
                console.log("Server is successfully listening on Port no 7777");
            });
        }).catch(()=>{
            console.error("Database Connection is not doen!!!");   
        });


