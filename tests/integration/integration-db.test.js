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
                genre: "Fantasy", 
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

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });

});