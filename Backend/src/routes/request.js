const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type"+status})
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).send("user not found")
        }

        //TO check if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId},
            ],
        });
        
        if(existingConnectionRequest){
             return res.status(400).send("Connection request is already exist")
        }
        const connectionRequestModel = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequestModel.save();

        res.json({
            message:`${user.firstName} is ${status} in ${toUser.firstName}`,
            data,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send("Error :" + err.message);
    }
});

module.exports = requestRouter;