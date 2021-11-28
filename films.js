const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    name: String, 
    rating: Number
});

filmSchema.methods.all = function() {
    return {name: this.name, rating: this.rating};
}

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;