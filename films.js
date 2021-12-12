const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const filmSchema = new mongoose.Schema({
    id:  {type:Number,unique: true, sparse: true},
    name: String,
    rating: Number
});

filmSchema.plugin(AutoIncrement,{inc_field: 'id',id:"id"});

filmSchema.methods.all = function() {
    return {id: this.id,
            name: this.name, 
            rating: this.rating};
}

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;