var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";

//Models
const Film = require('./films');

//Moment
const moment = require('moment');
const today = moment().startOf('day');

var app = express();
app.use(bodyParser.json());

//TEST CONTENT
app.get("/", (req, res) => {
    res.send("<html><body><h1>My server</h1></body></html>");
});

//GET ALL FILMS
app.get(BASE_API_PATH + "/films", (req, res) => {

    console.log(Date() + " - GET /films");

    // Filter
    var filter = {};

    //Filter films between dates
    var queries = req.query;
    var startDate = req.query.startDate ? moment(req.query.startDate, "YYYY-MM-DD").toDate() : null;
    var endDate = req.query.endDate ? moment(req.query.endDate, "YYYY-MM-DD").toDate() : null;
    var year = req.query.year ? req.query.year : null;

    if(year) {
        filter = {
            released_at: {
                $gte: moment(req.query.year+"-01-01", "YYYY-MM-DD").toDate(), 
                $lt: moment(req.query.year+"-12-31", "YYYY-MM-DD").toDate()
            }
        }
    } else {
        if(startDate || endDate) {

            if(startDate && endDate) {
                filter = {
                        released_at: {
                            $gte: startDate, 
                            $lt: endDate
                        }
                    }
            } else if (startDate) {
                filter = {
                    released_at: {
                        $gte: startDate
                    }
                }
            } else {
                filter = {
                    released_at: {
                        $lt: endDate
                    }
                }
            }
    
        }
    }

    

    // Sort films by release date
    var sort = { released_at: queries.sort === "des" ? -1 : 1 }

    // Sort films by genre
    if(req.query.genre){
        filter.genre = req.query.genre;
    }

    // Sort films by rating
    if(req.query.rating){
        filter.rating = {
            $gte: req.query.rating
        }
    }

    // Find 
    Film.find(filter, function(err, films) {
        if (err) {
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        }
        else {
            res.send(films.map((film) => {
                return film.all();
            }));
        }
    }).sort(sort);
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
      
            if (err.errors || err.name === "MongoServerError") {
              res.status(400).send({ error: err.message })
            } else {
              res.sendStatus(500);
            }
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