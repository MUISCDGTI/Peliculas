var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";

// Models
const Film = require('./films');

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
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

app.get(BASE_API_PATH + "/films/:id", (req, res) => {
    console.log(Date() + " - GET /films/id");

    Film.find({id:req.params.id}, (err, films) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(404);
        } else {
            res.send(films.map((film)=>{
                return film;
            }));
        }
    });
});

app.post(BASE_API_PATH + "/films", (req, res) => {
    console.log(Date() + " - POST /films");

    var film = req.body;
    console.log(req.body);
    Film.create(film, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.put(BASE_API_PATH + "/films/:id", (req, res) => {
    console.log(Date() + " - PUT /films/id");
    console.log(req.body);
    Film.findOneAndUpdate({id:req.params.id},{name:req.body.name,rating:req.body.rating}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete(BASE_API_PATH + "/films/:id", (req, res) => {
    console.log(Date() + " - DELETE /films/id");
    Film.findOneAndDelete({id:req.params.id}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
});

app.delete(BASE_API_PATH + "/films", (req, res) => {
    console.log(Date() + " - DELETE /films");

    Film.deleteMany({}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = app;