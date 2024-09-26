const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { Error } = require("mongoose");

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

app.delete("/user",async (req,res)=>{
    const userId = req.body.userId;
    try{
        const userID = User.findByIdAndDelete(userId)
        res.send("User deleted Sucessfully\....")
    }catch(err){
        res.status(400).send("No user...")
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    // console.log(userId);
    const data = req.body;
    // console.log(data);
    
    try{
            const ALLOWED_UPDATES = [
                "photoUrl",
                "about",
                "age",
                "skills",
                "gender"
            ];
        
            const isUpdateAllowed = Object.keys(data).every((k)=>
                ALLOWED_UPDATES.includes(k)
               //{  return ALLOWED_UPDATES.includes(k)}
            );
        
            if(!isUpdateAllowed){
               throw new Error("Updaet not allowed");
            }
            
            if(data?.skills.length > 10){
                throw new Error ("Skills can not be more that 10")
            }
        
            
        await User.findByIdAndUpdate({_id: userId},data, {
           returnDocument : "after",
            runValidators : true
        });

        res.send("user updated sucessfully")
    }catch(err){
        res.status(400).send("Update failed!!!"+ err.message)
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


