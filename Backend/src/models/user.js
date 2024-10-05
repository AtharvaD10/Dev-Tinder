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
        //default :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAACUCAMAAAAu5KLjAAAAMFBMVEXm5uampqajo6PBwcHp6emgoKDd3d20tLSpqanW1tbh4eG7u7vHx8evr6/Q0NDKyspTo5x3AAADQElEQVR4nO2b227sIAxFE+JMArn9/98emEubaZsEsNmMdLxeWqkvSw4YsN2mURRFURRFURRFURRFUa4gz/7nB+LNnN26bvJ03WbdB6p6IdstbduaJ/7XpbP3P3wMFBz7oPaG6YPpx4iSndpfjk/TdrIf4nkbDhyfpsOttmH43vNRJL8jOtf+8uTOQ/kKqKvqSetVKF8BXWt6bn2MZKDfqknSHBXKZ0DnSvGkLjqW93h2VTxpTbL0njXWJ9k0yQA+05OL2+N7TAvPSzQlW3rPCaxJa4al9wQvT7fkWPrLnUNaJmXMt3BCs6fLkwwAw0lzYsr8pkeGc8yP5giTzNzmD4CbPSdnfmlOKMvcbPQAlpMyTvM9FmNJG+Ob+6++YRZn1nG+00Qd7AtPc8FYNhzJAMbSsYLpw4nZ6rfsk/JBj6mCsDUxGcmqpiD/y9oEFRK5CQljybkUB0AXY4opaZ4EcwBdPTqeJqrkxXljhFcGxrK5sRbnCOsYcBanGVCWNHOiiXuoM4oeyLIH45mBrB1S/nnZ35C1rtxw4ooJd2xmThpBj/QXeeEEB7OhvPvHiO6xks1pEVToradfQEwHl2zSlyd6Yb5IK9LAijI/iWr5f1kO0F7LDnJDfD+94oACuSnSs5+qjlHQFtNhNS2o9Hrsaa83klnqzyLRZQL16bK2JTV2uP7oQ90RNGrWwcSsTTOs9UTJRkk+RSutz5A1U9J7lcxJzTamnunjBr/HZb3V/Rsd6kk2fW7m7gmdlaPLYchDT+QUBackh7sbc3uWIEtu7R3iyYslKJ7MUvHTs3TBmOLnX8/oy94/c6Yh/6bkCU+31APyCDMWrMwxWy1vnuXaLkIL80G55cnrYPykWEeDnzH3FMqeyZPZV5SZ3CbeXM9vzFJAUzyYZcLJm9/7mwJTfau8ZdvKd1llt/kD+c3uxFdmoBf+6oyh51NN4ZcRFdhAAdmclNVeiUG2BZP9XwOXmrJfvcQ+v2uK7vUSuf2BaIYXe1v8RrIlzJvNPsNI/mOjxKv3QFOwVsMcIT/VlJz9kL5q7jQlO5mlJANyltwR8jMEx8u5869nCM7GqqaspimGoKbrClJraEFRFEVRFEVB8A8WdSfAWVqJTwAAAABJRU5ErkJggg==",
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
