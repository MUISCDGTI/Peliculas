var express = require('express');

var port = 3000;

console.log("Starting API server...");

var app = express();

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.listen(port);

console.log("Server ready!");