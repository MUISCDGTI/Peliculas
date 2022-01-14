const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const filmSchema = new mongoose.Schema({
    id:  {
        type:Number,
        unique: true,
        sparse: true},
    title: {
        type: String,
        unique: true,
        required: [true, 'Film title is needed']
    },
    genre: [String],
    released_at: {
        type: Date,
        required: true,
    },
    poster: String,
    director: String,
    original_language: String,
    overview: String,
    rating: {
        type: Number,
        min: [0, 'Too low rating, it must be between 0 and 10'],
        max: [10, 'Too high rating, it must be between 0 and 10']
    }
});

filmSchema.plugin(AutoIncrement,{inc_field: 'id',id:"id"});

filmSchema.methods.all = function() {
    return {id: this.id,
            title: this.title,
            genre: this.genre,
            released_at: this.released_at,
            poster: this.poster,
            director: this.director,
            original_language: this.original_language,
            overview: this.overview,
            rating: this.rating};
}

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;