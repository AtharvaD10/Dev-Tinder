const mongoose = require("mongoose");

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
        trim : true
    },
    password :{
        type : String,
        required : true,
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
        type : String
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

module.exports = mongoose.model("User",userSchema);

// module.exports = User;