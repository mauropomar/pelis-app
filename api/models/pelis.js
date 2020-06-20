'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PelisSchema = Schema({
    title: String,
    genre: String,
    imdbrating:String,
    year:String,
    director:String,
    actors:String,
    type:String,
    imagen:String,
});

module.exports = mongoose.model('Pelis', PelisSchema);