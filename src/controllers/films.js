const express = require("express");
const app = express.Router();

var Film = require("../models/film.js");

//Moment
const moment = require('moment');
const today = moment().startOf('day');

//GET ALL FILMS
app.get("/", (req, res) => {

    console.log(Date() + " - GET /films");

    var queries = req.query;

    var startDate = req.query.startDate ? moment(req.query.startDate, "YYYY-MM-DD").toDate() : null;
    var endDate = req.query.endDate ? moment(req.query.endDate, "YYYY-MM-DD").toDate() : null;
    var year = req.query.year ? req.query.year : null;

    if (queries.rating) {
      queries.rating = { $gte: queries.rating };
    }
  
    if(year) {
        queries.released_at = {
                $gte: moment(req.query.year+"-01-01", "YYYY-MM-DD").toDate(), 
                $lt: moment(req.query.year+"-12-31", "YYYY-MM-DD").toDate()
        }
    } else {
        if(startDate || endDate) {

            if(startDate && endDate) {
                queries.released_at = {
                        $gte: startDate, 
                        $lt: endDate
                    }
            } else if (startDate) {
                queries.released_at = {
                    $gte: startDate
                }
            } else {
                queries.released_at = {
                    $lt: endDate
                }
            }
    
        }
    }
  
    Film.find(
      queries,
      null,
      { sort: { released_at: queries.sort === "des" ? -1 : 1 } },
      (err, films) => {
        if (err) {
          console.log(Date() + " - " + err);
          res.sendStatus(500);
        } else {
          res.send(
            films.map((film) => {
              return film;
            })
          );
        }
      }
    );

});

//GET FILM BY ID
app.get("/:film_id", (req, res) => {
    console.log(Date() + " - GET /films BY ID");
    let id = req.params.film_id;
  
    Film.findById({ _id:id }, (err, film) => {
      if (err) {
        console.log(Date() + " - " + err);
        res.sendStatus(500);
      } else {
        res.send(film);
      }
    });
  });

//POST A NEW FILM
app.post("/", (req, res) => {
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
app.put("/:id", (req, res) => {
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
app.delete("/:id", (req, res) => {
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
app.delete("/", (req, res) => {
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

module.exports = app;