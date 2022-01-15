const Film = require("../../src/models/film.js");
const mongoose = require("mongoose");
const dbConnect = require("../../db.js");

describe("Films DB connection", () => {

    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        Film.deleteMany({}, (err) => {
            done();
        });
    });

    it("writes a film in the DB", (done) => {

        const film = new Film(
            {
                title: "Harry Potter and the Globet of Fire", 
                released_at: "2005-11-25",
                rating: 10
            }
        );

        film.save((err, film) => {
            expect(err).toBeNull();
            Film.find({}, (err, films) => {
                expect(films).toBeArrayOfSize(1);
                done();
            });
        });
    });

    it("not writes a film without title in the DB", (done) => {

        const film = new Film(
            {
                title: "", 
                genre: "Fantasy", 
                released_at: "2005-11-25",
                rating: 10
            }
        );

        film.save((err, film) => {
            err_message = "Film validation failed: title: Film title is needed"
            expect(err.message).toEqual(err_message);
            done();
        });
    });

    it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        ("writes a film in the DB with value between max and min rating", (value, done) => {
        const film = new Film(
            {
                title: "Harry Potter and the Globet of Fire", 
                genre: "Fantasy", 
                released_at: "2005-11-25",
                rating: value
            }
        );

        film.save((err, film) => {
            expect(err).toBeNull();
            Film.find({}, (err, films) => {
                expect(films).toBeArrayOfSize(1);
                done();
            });
        });
    });

    it.each([-1, -2, 11, 12])
        ("not writes a film in the DB with value less than minimun or more than the maximum", (value, done) => {
       
            const film = new Film(
                {
                    title: "Harry Potter and the Globet of Fire", 
                    genre: "Fantasy", 
                    released_at: "2005-11-25",
                    rating: value
                }
            );

            film.save((err, film) => {
                let high_low = value < 0 ? "low" : "high";
                err_message = "Film validation failed: rating: Too " + high_low + " rating, it must be between 0 and 10"
                expect(err.message).toEqual(err_message);
                done();
            });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

});