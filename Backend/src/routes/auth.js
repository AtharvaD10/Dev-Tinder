const express = require("express")
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt');
const User = require("../models/user");
const validator = require("validator")
const { Error } = require("mongoose");
const { userAuth } = require("../middlewares/auth");


authRouter.post("/signup",async (req,res)=>{
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

authRouter.post("/login",async(req,res)=>{
    try{
           const {emailId,password} = req.body;
           if(!validator.isEmail(emailId)){
            throw new Error("Enter Valid emailId");
           }
           const user = await User.findOne({emailId : emailId})
           if(!user){
            throw new Error("Invalid credentials")
           }
            const isPasswordValid  = await user.validatePassword(password);

           if(isPasswordValid){
            //create a JWT token
            const token = await user.getJWT();
            //Add the token to cookie and send the response back to the user
            res.cookie("token",token)
            res.send(user)
           }else{
            throw new Error("Invalid credentials")
           }
       }
     catch(err){
        res.status(400).send("Error :"+err.message)
    }
})

authRouter.post("/logout",userAuth,(req,res)=>{
    const user = req.user;
    res.cookie("token",null, {
        expires: new Date(Date.now()),
    })
    .send(`${user.firstName} you logout sucessfully`);
})

module.exports = authRouter;