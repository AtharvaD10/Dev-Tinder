const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")

const app = express();
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');

app.use('/', authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

connectDB()
        .then(()=>{
            console.log("Database Connection Sucessfully...");
            app.listen(7777, () => {
                console.log("Server is successfully listening on Port no 7777");
            });
        }).catch(()=>{
            console.error("Database Connection is not doen!!!");   
        });


