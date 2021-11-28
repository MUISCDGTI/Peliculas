var express = require('express');
var db = require("./db");
var bodyParser = require('body-parser');
const Film = require('./films');

var port = (process.env.PORT || 3000); 
var BASE_API_PATH = "/api/v1";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());

db().then(
  () => {
    app.listen(port);
    console.log("Server ready!");
  },
  (err) => {
    console.log("Connection error: " + err);
  }
);

app.get(BASE_API_PATH + "/", (req, res) => {
  res.send("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/films", (req, res) => {
  console.log(Date() + " - GET /films");

  Film.find({}, (err, films) => {
      if (err) {
          console.log(Date() + "-" + err);
          res.sendStatus(500);
      } else {
          res.send(films.map((film) => {
              return film.all();
          }));
      }
  });
});
app.post(BASE_API_PATH + "/films", (req, res) => {
  console.log(Date() + " - POST /films");
  var film = req.body;
  Film.create(film, (err) => {
      if (err) {
          console.log(Date() + " - " + err);
          res.sendStatus(500);
      } else {
          res.sendStatus(201);
      }
  });
});
module.exports = app;
