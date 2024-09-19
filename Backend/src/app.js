const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

app.get("/home", (req, res) => {
    res.send("Heyy ..... from ......");
});

app.get("/class", (req, res) => {
    res.send("Heyy ..... from ......class");
});

app.listen(4000, () => {
    console.log("Server is successfully listening on Port no 4000");
});
