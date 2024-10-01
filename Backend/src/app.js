const express = require("express");
const { Error } = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require("validator")
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser")
const {validateSignUpData} = require("./utils/validation")
const jwt = require("jsonwebtoken")
const {userAuth} = require("./middlewares/auth")

const app = express();
app.use(express.json())
app.use(cookieParser())



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

            //create a JWT token
            const token = await jwt.sign({_id : user._id}, "$Dev@Tinder#45",{expiresIn : "1d"})
            
            // console.log(token);

            //Add the token to cookie and send the response back to the user
            res.cookie("token",token)
            res.send("Login sucessfully...")
           }else{
            throw new Error("Invalid credentials")
           }
           
       }
     catch(err){
        res.status(400).send("Error :"+err.message)
    }
})

app.get("/profile", userAuth,async(req, res) => {
    
    try{
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error :"+err.message);
    }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    try {
          const user = req.user;
          res.send(`${user.firstName} sent the connection request`)
    } catch (err) {
            res.status(400).send("Error :" +err.message);
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


