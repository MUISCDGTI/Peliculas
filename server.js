var express = require("express");
var bodyParser = require("body-parser");
require('./passport.js');

var BASE_API_PATH = "/api/v1";
var films = require('./src/controllers/films')

const passport = require('passport');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./apidocs.json');

var app = express();
app.use(bodyParser.json());
app.use(BASE_API_PATH + '/films', films)
app.use(passport.initialize());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.get("/", (req, res) => {
  res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/healthz", (req, res) => {
  res.sendStatus(200);
});

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = app;