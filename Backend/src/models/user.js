const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
require('dotenv').config();
const JWT_TOKEN = process.env.JWT_TOKEN

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 20
    },
    lastName :{
        type : String,
        minLength : 2,
        maxLength : 20
    },
    emailId :{
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error ("Invalid email address "+email);
            }
        }
    },
    password :{
        type : String,
        required : true,
        validate(password){
            if(!validator.isStrongPassword(password)){
                throw new Error ("Password is not Strong "+password);
            }
        }
    },
    age :{
        type : Number,
        min : 18
    },
    gender :{
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is invalid...");
                
            }
        }
    },
    photoUrl : {
        type : String,
        default :"https://geographyandyou.com/images/user-profile.png",
        validate(url){
            if(!validator.isURL(url)){
                throw new Error ("Invalid photo url "+url);
            }
        }
    },
    about : {
        type : String,
        default : "This defalut about of the user!"
    },
    skills : {
        type : [String]
    },
     resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps : true
})

userSchema.methods.getJWT =async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id}, JWT_TOKEN,{expiresIn : "1d"})
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid =  await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
};

module.exports = mongoose.model("User",userSchema);
