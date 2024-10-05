const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")

require('dotenv').config();

const app = express();
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require("./routes/user");

app.use('/', authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

const Port = process.env.PORT ;

connectDB()
        .then(()=>{
            console.log("Database Connection Sucessfully...");
            app.listen(Port, () => {
                console.log(`Server is successfully listening on Port no ${Port}`);
            });
        }).catch(()=>{
            console.error("Database Connection is not doen!!!");   
        });


