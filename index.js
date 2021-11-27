var express = require('express');
var db = require("./db");

var port = 3000;

console.log("Starting API server...");

var app = express();

app.get("/", (req, res) => {
    res.send("Hello world!");
});

db().then(
    () => {
      app.listen(port);
      console.log("Server ready!");
    },
    (err) => {
      console.log("Connection error: " + err);
    }
  );