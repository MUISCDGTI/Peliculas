const app = require("../server.js");
const request = require("supertest");
const Film = require("../src/models/film.js");
const ApiKey = require('../apikeys.js');

describe("Films API", () => {

    describe("GET /", () => {
      it("should return an HTML document", () => {
        return request(app)
          .get("/")
          .then((response) => {
            expect(response.status).toBe(200);
            expect(response.type).toEqual(expect.stringContaining("html"));
            expect(response.text).toEqual(expect.stringContaining("h1"));
          });
      });
    });

  
    describe("GET /films", () => {

        beforeAll(() => {

            const films = [
                {
                    id: 1,
                    title: "Spiderman Homecoming",
                    genre: "Action",
                    released_at: "2017-07-28T00:00:00.000Z",
                    rating: "9",
                },{
                    id: 2,
                    title: "Spiderman No Way Home",
                    genre: "Action",
                    released_at: "2021-12-17T00:00:00.000Z",
                    rating: "9"
                },{
                    id: 3,
                    title: "It",
                    genre: "Terror",
                    released_at: "2017-09-08T00:00:00.000Z",
                    rating: "6.4"
                }
            ];

            const user = {
              user : 'test',
              apikey: '1'
            }

            dbFind = jest.spyOn(Film, "find");
            dbFind.mockImplementation((query, sm, sort, callback) => {
                callback(null, films);
            });

            auth = jest.spyOn(ApiKey, "findOne");
            auth.mockImplementation((query, callback) => {
              callback(null, new ApiKey(user));
            })
        });

        it("should return all films", () => {

            return request(app)
                .get("/api/v1/films")
                .set('apikey', '1')
                .then((response) => {

                    expect(response.statusCode).toBe(200);

                    expect(dbFind).toBeCalledWith(
                        {},
                        null,
                        { sort: { released_at: 1 } },
                        expect.any(Function)
                      );

                    expect(response => {console.log(response)})

                });
        });

        it("should return all films", () => {

            return request(app)
                .get("/api/v1/films")
                .set('apikey', '1')
                .then((response) => {

                    expect(response.statusCode).toBe(200);

                    expect(dbFind).toBeCalledWith(
                        {},
                        null,
                        { sort: { released_at: 1 } },
                        expect.any(Function)
                      );

                    expect(response => {console.log(response)})

                });
        });

        it("should return all films sortered des", () => {

          dbFind.mockImplementation((query, sm, sort, callback) => {

            callback(null, [

              {
                  id: 2,
                  title: "Spiderman No Way Home",
                  genre: "Action",
                  released_at: "2021-12-17T00:00:00.000Z",
                  rating: "9"
              },{
                id: 3,
                title: "It",
                genre: "Terror",
                released_at: "2017-09-08T00:00:00.000Z",
                rating: "6.4"
              },{
                id: 1,
                title: "Spiderman Homecoming",
                genre: "Action",
                released_at: "2017-07-28T00:00:00.000Z",
                rating: "9",
              }
            ]);

          });

          return request(app)
            .get("/api/v1/films")
            .set('apikey', '1')
            .query({ sort: 'des' })
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toStrictEqual([
                {
                    id: 2,
                    title: "Spiderman No Way Home",
                    genre: "Action",
                    released_at: "2021-12-17T00:00:00.000Z",
                    rating: "9"
                },{
                  id: 3,
                  title: "It",
                  genre: "Terror",
                  released_at: "2017-09-08T00:00:00.000Z",
                  rating: "6.4"
                },{
                  id: 1,
                  title: "Spiderman Homecoming",
                  genre: "Action",
                  released_at: "2017-07-28T00:00:00.000Z",
                  rating: "9",
                },
              ]);
              expect(dbFind).toBeCalledWith(
                { sort: 'des' },
                null,
                { sort: { released_at: -1 } },
                expect.any(Function)
              );
            });
        });

        it("should return all films filtered by genre", () => {

          dbFind.mockImplementation((query, sm, sort, callback) => {

            callback(null, [

              {
                  id: 2,
                  title: "Spiderman No Way Home",
                  genre: "Action",
                  released_at: "2021-12-17T00:00:00.000Z",
                  rating: "9"
              },{
                id: 1,
                title: "Spiderman Homecoming",
                genre: "Action",
                released_at: "2017-07-28T00:00:00.000Z",
                rating: "9",
              }
            ]);

          });

          return request(app)
            .get("/api/v1/films")
            .set('apikey', '1')
            .query({ genre: 'Action' })
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toStrictEqual([
                {
                    id: 2,
                    title: "Spiderman No Way Home",
                    genre: "Action",
                    released_at: "2021-12-17T00:00:00.000Z",
                    rating: "9"
                },{
                  id: 1,
                  title: "Spiderman Homecoming",
                  genre: "Action",
                  released_at: "2017-07-28T00:00:00.000Z",
                  rating: "9",
                },
              ]);
              expect(dbFind).toBeCalledWith(
                { sort: 'des' },
                null,
                { sort: { released_at: -1 } },
                expect.any(Function)
              );
            });
        });

        it("should return all films between two dates", () => {

          dbFind.mockImplementation((query, sm, sort, callback) => {

            callback(null, [
              {
                id: 1,
                title: "Spiderman Homecoming",
                genre: "Action",
                released_at: "2017-07-28T00:00:00.000Z",
                rating: "9",
              },{
                id: 3,
                title: "It",
                genre: "Terror",
                released_at: "2017-09-08T00:00:00.000Z",
                rating: "6.4"
              }
            ]);

          });

          return request(app)
            .get("/api/v1/films")
            .set('apikey', '1')
            .query({ startDate: '2017-01-01', endDate: '2021-01-01' })
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toStrictEqual([
                {
                  id: 1,
                  title: "Spiderman Homecoming",
                  genre: "Action",
                  released_at: "2017-07-28T00:00:00.000Z",
                  rating: "9",
                },{
                  id: 3,
                  title: "It",
                  genre: "Terror",
                  released_at: "2017-09-08T00:00:00.000Z",
                  rating: "6.4"
                },
              ]);
              expect(dbFind).toBeCalledWith(
                { sort: 'des' },
                null,
                { sort: { released_at: -1 } },
                expect.any(Function)
              );
            });
        });

        it("should return all films filtered by year", () => {

          dbFind.mockImplementation((query, sm, sort, callback) => {

            callback(null, [
              {
                id: 1,
                title: "Spiderman Homecoming",
                genre: "Action",
                released_at: "2017-07-28T00:00:00.000Z",
                rating: "9",
              },{
                id: 3,
                title: "It",
                genre: "Terror",
                released_at: "2017-09-08T00:00:00.000Z",
                rating: "6.4"
              }
            ]);

          });

          return request(app)
            .get("/api/v1/films")
            .set('apikey', '1')
            .query({ year: '2017'})
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toStrictEqual([
                {
                  id: 1,
                  title: "Spiderman Homecoming",
                  genre: "Action",
                  released_at: "2017-07-28T00:00:00.000Z",
                  rating: "9",
                },{
                  id: 3,
                  title: "It",
                  genre: "Terror",
                  released_at: "2017-09-08T00:00:00.000Z",
                  rating: "6.4"
                },
              ]);
              expect(dbFind).toBeCalledWith(
                { sort: 'des' },
                null,
                { sort: { released_at: -1 } },
                expect.any(Function)
              );
            });
        });

        it("should return all films filtered by rating", () => {

          dbFind.mockImplementation((query, sm, sort, callback) => {

            callback(null, [
              {
                id: 1,
                title: "Spiderman Homecoming",
                genre: "Action",
                released_at: "2017-07-28T00:00:00.000Z",
                rating: "9",
              },{
                id: 2,
                title: "Spiderman No Way Home",
                genre: "Action",
                released_at: "2021-12-17T00:00:00.000Z",
                rating: "9"
              }
            ]);

          });

          return request(app)
            .get("/api/v1/films")
            .set('apikey', '1')
            .query({ rating: 6.5})
            .then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toStrictEqual([
                {
                  id: 1,
                  title: "Spiderman Homecoming",
                  genre: "Action",
                  released_at: "2017-07-28T00:00:00.000Z",
                  rating: "9",
                },{
                  id: 2,
                  title: "Spiderman No Way Home",
                  genre: "Action",
                  released_at: "2021-12-17T00:00:00.000Z",
                  rating: "9"
                },
              ]);
              expect(dbFind).toBeCalledWith(
                { sort: 'des' },
                null,
                { sort: { released_at: -1 } },
                expect.any(Function)
              );
            });
        });

    });

    describe("GET /films BY ID", () => {

      beforeAll(() => {

        const film = 
          {
            _id: 1,
            title: "Spiderman Homecoming",
            genre: "Action",
            released_at: "2017-07-28T00:00:00.000Z",
            rating: "9",
          };

        dbFindById = jest.spyOn(Film, "findById");
        dbFindById.mockImplementation((r, callback) => {
          callback(null, film);
        });

     });

     it("should return a film by id", () => {
      return request(app)
        .get("/api/v1/films/1")
        .set('apikey', '1')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toStrictEqual({
            _id: 1,
            title: "Spiderman Homecoming",
            genre: "Action",
            released_at: "2017-07-28T00:00:00.000Z",
            rating: "9",
          });
          expect(dbFindById).toBeCalledWith(
            { _id: "1" },
            expect.any(Function)
          );
        });
      });

      it("should not return any film due to incorrect id", () => {
        dbFindById.mockImplementation((r, callback) => {
          callback(`CastError: Cast to ObjectId failed for value "{ _id: '100' }" (type Object) at path "_id" for model "Film"`, null);
        });
  
        return request(app)
          .get("/api/v1/films/100")
          .set('apikey', '1')
          .then((response) => {
            expect(response.statusCode).toBe(404);
            expect(response.body).toStrictEqual({});
            expect(dbFindById).toBeCalledWith(
              { _id: "100" },
              expect.any(Function)
            );
          });
      });

    });

    describe("POST /films", () => {

      beforeAll(() => {
        const film = 
          {
            title: "Spiderman Homecoming 2",
            genre: ["Action"],
            released_at: "2017-07-288888",
            rating: 9,
          };
  
        dbCreate = jest.spyOn(Film, "create");
        dbCreate.mockImplementation((r, callback) => {
          callback(null, film);
        });
      });

      const film = {
        title: "Spiderman Homecoming 2",
        genre: ["Action"],
        released_at: "2017-07-28",
        rating: 9,
      }
  
      it("should create a film", () => {
        return request(app)
          .post("/api/v1/films")
          .set('apikey', '1')
          .send(film)
          .then((response) => {
            expect(response.statusCode).toBe(201);
            expect(dbCreate).toBeCalledWith(
              expect.anything(),
              expect.any(Function)
            );
          });
      });

    });

    describe("PUT /films FILM", () => {

      beforeAll(() => {
        const film = 
          {
            _id : "1",
            title: "Spiderman Homecoming 2",
            genre: ["Action"],
            released_at: "2017-07-28",
            rating: 9,
          };
  
        dbFindOneAndUpdate = jest.spyOn(Film, "findOneAndUpdate");
        dbFindOneAndUpdate.mockImplementation((id, body, validator, callback) => {
          callback(null, film);
        });
      });

      let body = { title: "Spiderman Homecoming 2" };
  
      it("should update a film title by id", () => {
        return request(app)
          .put("/api/v1/films/1")
          .set('apikey', '1')
          .send(body)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(dbFindOneAndUpdate).toBeCalledWith(
              { _id: "1" },
              body,
              { runValidators: true },
              expect.any(Function)
            );
            expect(response.body).toEqual(
              {
                _id : "1",
                title: "Spiderman Homecoming 2",
                genre: ["Action"],
                released_at: "2017-07-28",
                rating: 9,
              });
          });
      });

      body_2 = { title: null };

      it("should not update a film title by id", () => {
        return request(app)
          .put("/api/v1/films/1")
          .set('apikey', '1')
          .send(body_2)
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(dbFindOneAndUpdate).toBeCalledWith(
              { _id: "1" },
              body,
              { runValidators: true },
              expect.any(Function)
            );
            expect(response.body).toStrictEqual(
              {
                _id : "1",
                title: "Spiderman Homecoming 2",
                genre: ["Action"],
                released_at: "2017-07-28",
                rating: 9,
              });
          });
      });

    });

    describe("DELETE /films/:film_id", () => {
      beforeAll(() => {

        const film = {
          _id: 1,
          title: "Spiderman Homecoming",
          genre: "Action",
          released_at: "2017-07-28T00:00:00.000Z",
          rating: "9",
        };
  
        dbDelete = jest.spyOn(Film, "deleteOne");
      });

      it("should delete a film", () => {
        dbDelete.mockImplementation((r, callback) => {
          callback(false);
        });
        return request(app)
          .delete("/api/v1/films/1")
          .set('apikey', '1')
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(dbDelete).toBeCalledWith(
              { _id: "1" },
              expect.any(Function)
            );
          });
      });

      it("should not delete a film", () => {
        dbDelete.mockImplementation((r, callback) => {
          callback(false);
        });
        return request(app)
          .delete("/api/v1/films/100")
          .set('apikey', '1')
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(dbDelete).toBeCalledWith(
              { _id: "100" },
              expect.any(Function)
            );
          });
      });


    });

    

});
  
    /* 
  
    describe("DELETE /ratings/:rating_id", () => {
      beforeAll(() => {
        const rating = {
          value: "4.5",
          description: "Good film",
          film: "1",
          user: "11",
          date: "2020-12-02T23:00:00.000+00:00",
        };
  
        dbDelete = jest.spyOn(Rating, "deleteOne");
      });
  
      it("should delete a rating", () => {
        dbDelete.mockImplementation((r, callback) => {
          callback(false);
        });
        return request(app)
          .delete("/api/v1/ratings/619e98f2ac8738570c90a206")
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(dbDelete).toBeCalledWith(
              { _id: "619e98f2ac8738570c90a206" },
              expect.any(Function)
            );
          });
      });
  
      it("should not delete a rating due to does not exist rating", () => {
        dbDelete.mockImplementation((r, callback) => {
          callback(true);
        });
        return request(app)
          .delete("/api/v1/ratings/delete")
          .then((response) => {
            expect(response.statusCode).toBe(500);
            expect(dbDelete).toBeCalledWith(
              { _id: "delete" },
              expect.any(Function)
            );
          });
      });
    });

    */