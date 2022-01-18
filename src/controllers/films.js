const express = require("express");
const app = express.Router();
require('../../passport.js');
const passport = require('passport');

var Film = require("../models/film.js");

//Moment
const moment = require('moment');
const today = moment().startOf('day');

//GET ALL FILMS
app.get("/", passport.authenticate('localapikey', {session:false}), 

  (req, res) => {

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
app.get("/:film_id", passport.authenticate('localapikey', {session:false}), (req, res) => {
    console.log(Date() + " - GET /films/id");
    let id = req.params.film_id;
  
    Film.findById({ _id:id }, (err, film) => {
      if (err) {
        console.log(Date() + " - " + err);
        res.sendStatus(404);
      } else {
        res.send(film);
      }
    });
  });

//POST A NEW FILM
app.post("/",passport.authenticate('localapikey', {session:false}), (req, res) => {
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
            res.status(201).json(film);
          }
    });
});

//MODIFY AN EXISTING FILM FOUND BY ID
app.put("/:film_id", passport.authenticate('localapikey', {session:false}), (req, res) => {
    console.log(Date() + " - PUT /films/id");

    let id = req.params.film_id;
    let body = req.body;

    const filter = { _id: id };
    const update = body;

    Film.findOneAndUpdate(filter, update, { runValidators: true }, (err, film) => {
        if (err) {

            console.log(Date() + " - " + err);

            if (err.errors) {
                res.status(400).send({ error: err.message })
            } else {
            res.sendStatus(500);
            }
        } else {

            res.send(film);

            /*
            Film.findById({ _id:id }, (err, film_changed) => {
                res.send(film_changed);
            });
            */

        }
      });
 });

// DELETE EXISTING FILM FOUND BY ID
app.delete("/:film_id",passport.authenticate('localapikey', {session:false}), (req, res) => {
    console.log(Date() + " - DELETE /films/:film_id");
    const film_id = req.params.film_id;
    Film.deleteOne({ _id: film_id }, (err, film) => {
      if (err) {
        console.log(Date() + " - " + err);
        res.sendStatus(404);
      } else {
        res.sendStatus(200);
      }
    });
  });

//DELETE ALL FILMS FROM THE COLLECTION
app.delete("/", passport.authenticate('localapikey', {session:false}),(req, res) => {
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