<<<<<<< HEAD
const mongoose = require("mongoose");
const DB_URL = process.env.MONGO_URL || "mongodb://localhost:27017"; // dirección alternativa -> mongodb://db/test

const dbConnect = function () {
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  return mongoose.connect(DB_URL, { useNewUrlParser: true });
};

=======
const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb://localhost:27017');

const dbConnect = function() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, { useNewUrlParser: true });
}

>>>>>>> master
module.exports = dbConnect;