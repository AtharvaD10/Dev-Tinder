const jwt = require("jsonwebtoken");
const User = require("../models/user")


const userAuth = async(req,res,next)=>{
   try{
          const {token} = req.cookies;
      
          if(!token){
                    throw new Error("Token is not there")
             }

        const isTokenValid = await jwt.verify(token,"$Dev@Tinder#45")

        const {_id} = isTokenValid;
        const user =await User.findById(_id);

        if(!user){
            throw new Error("User not found...")
        }

        req.user = user;
        next();
}catch(err){
    res.status(400).send("Error:" +err.message);
        }
}

module.exports = {
    userAuth
};