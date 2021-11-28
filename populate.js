
const Film = require('./films');

var film = {
    name : "Spiderman No Way Home",
    rating : 10
}

Film.create(film , function (err, small) {
    if (err) throw err;
    console.log("Film inserted");
  })

