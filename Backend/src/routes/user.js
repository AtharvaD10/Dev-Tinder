const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth')
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');


const  USER_SAFE_DATA = ["firstName","lastName","photoUrl","age","gender","about","skills"];
//get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const requestReceived = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId",USER_SAFE_DATA);

        res.json({
            message : "Data fetched sucessfully",
            requestReceived,
        })
    } catch (err) {
         return res.status(400).send("Error"+err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or:[
                {  toUserId : loggedInUser._id, status : "accepted"},
                { fromUserId : loggedInUser._id, status : "accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA)
          .populate("toUserId",USER_SAFE_DATA)

        const data = connections.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data})
    } catch (err) {
        res.status(400).send({message:"Error"+err.message})
    }
})

userRouter.get("/feed",userAuth, async(req,res)=>{
       
    //user should  see all the user cards except
    // his own cards
    //his connections
    //ignored people
    // already sent the connection request
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1)* limit;

        const connections = await ConnectionRequestModel.find({
            $or :[  {fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id} ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connections.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const usersFeed = await User.find({
           $and: [{_id: {$nin : Array.from(hideUsersFromFeed)}},
             {_id: {$ne: loggedInUser._id}}
            ] 
        }).select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit)
        res.send(usersFeed);

    } catch (err) {
        res.status(400).send({message:"Error"+err.message})
    }
})

module.exports = userRouter;