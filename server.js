var express = require("express");
var bodyParser = require("body-parser");

var BASE_API_PATH = "/api/v1";
var films = require('./src/controllers/films')

var app = express();
app.use(bodyParser.json());
app.use(BASE_API_PATH + '/films', films)

app.get("/", (req, res) => {
  res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
  res.sendStatus(200);
});


module.exports = app;