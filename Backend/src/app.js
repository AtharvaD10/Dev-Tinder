const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

// m is optional i.e hoe will also give you result
app.get("/hom?e", (req, res) => {
    res.send("Heyy ..... from ......");
});

// a is write multiple times i.e aaaaaa -- claaaaass
app.get("/cla+ss", (req, res) => {
    res.send("Heyy ..... from ......class");
});

// * u can write whatever in between this te and st
app.get("/te*st",(req,res)=>{
    res.send("Test is here ........");
});



app.listen(7777, () => {
    console.log("Server is successfully listening on Port no 7777");
});
