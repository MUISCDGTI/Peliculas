var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";

//Models
const Film = require('./films');

var app = express();
app.use(bodyParser.json());

//TEST CONTENT
app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

//GET ALL FILMS
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

//GET FILM BY ID
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

//POST A NEW FILM
app.post(BASE_API_PATH + "/films", (req, res) => {
    console.log(Date() + " - POST /films");
    var film = new Film(req.body);

    Film.create(film, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

//MODIFY AN EXISTING FILM FOUND BY ID
app.put(BASE_API_PATH + "/films/:id", (req, res) => {
    console.log(Date() + " - PUT /films/id");

    Film.countDocuments({id: req.params.id}, function (err, count){ 
        if(count>0){
            Film.findOneAndUpdate({id:req.params.id},
            {title:req.body.title,
            genre:req.body.genre,
            released_at:req.body.released_at,
            poster:req.body.poster,
            director:req.body.director,
            original_language:req.body.original_language,
            overview:req.body.overview,
            rating:req.body.rating
            }, (err) => {
                if (err) {
                    console.log(Date() + " - " + err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }else{
            res.sendStatus(404);
        }
    });     
});

//DELETE EXISTING FILM FOUND BY ID
app.delete(BASE_API_PATH + "/films/:id", (req, res) => {
    console.log(Date() + " - DELETE /films/id");

    Film.countDocuments({id: req.params.id}, function (err, count){ 
        if(count>0){
            Film.findOneAndDelete({id:req.params.id}, (err) => {
                if (err) {
                    console.log(Date() + " - " + err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }else{
            res.sendStatus(404);
        }
    });
});

//DELETE ALL FILMS FROM THE COLLECTION
app.delete(BASE_API_PATH + "/films", (req, res) => {
    console.log(Date() + " - DELETE /films");

    Film.deleteMany({}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

//HEALTH CHECK
app.get(BASE_API_PATH + "/healthz", (req, res) => {
    res.sendStatus(200);
  });

module.exports = app;