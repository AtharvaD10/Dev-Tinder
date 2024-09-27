const express = require("express");
const { Error } = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require("validator")
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation")

const app = express();
app.use(express.json())



app.post("/signup",async (req,res)=>{
    try{
            //validation of data
             validateSignUpData(req);

            //Encryption of Password
            const {firstName, lastName, emailId, password} = req.body;
            const hashPassword =  await bcrypt.hash(password,5);
            
            
            //creating a new instance of user model
            const user = new User({
                firstName,
                lastName,
                emailId,
                password:hashPassword
            });
              await user.save();
              res.send("User added sucessfully...");
        }catch(err){
        res.status(400).send("Error :"+err.message);
    }
});

app.post("/login",async(req,res)=>{
    try{
           const {emailId,password} = req.body;
           if(!validator.isEmail(emailId)){
            throw new Error("Enter Valid emailId");
           }
           const user = await User.findOne({emailId : emailId})
           if(!user){
            throw new Error("Invalid credentials")
           }
            const isPasswordValid  = await bcrypt.compare(password,user.password)

           if(isPasswordValid){
            res.send("Login sucessfully...")
           }else{
            throw new Error("Invalid credentials")
           }
           
       }
     catch(err){
        res.status(400).send("Error :"+err.message)
    }
})

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


