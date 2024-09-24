const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();
app.use(express.json())

app.post("/signup",async (req,res)=>{
  const user = new User(req.body);
  
    try{
        await user.save();
        res.send("User added sucessfully...");
    }catch(err){
        res.status(400).send("Error :"+err.message);
    }
  
    
});


app.get("/user",async (req,res)=>{
    const userEmail = req.body.emailId ;
    try{
        const users = await User.find({emailId : userEmail});
        if(users.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong!!!");
    }  
});


app.get("/feed",async (req,res)=>{
    const users =  await User.find({});
    try{
        res.send(users);
    }catch(err){
        res.status(400).send("No user...")
    }
})
connectDB()
        .then(()=>{
            console.log("Database Connection Sucessfully...");
            app.listen(7777, () => {
                console.log("Server is successfully listening on Port no 7777");
            });
        }).catch(()=>{
            console.error("Database Connection is not doen!!!");   
        });


