'use strinct'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Peli = require('../models/pelis');

function save(req, res) {
    var params = req.body;
    var peli = new Peli();
    peli.title = params.title;
    peli.genre = params.genre;
    peli.type = params.type;
    peli.imdbrating = params.imdbrating;
    peli.year = params.year;
    peli.director = params.director;
    peli.actors = params.actors;
    peli.poster = params.poster;
    peli.type = params.type;
    Peli.find({title: params.title},(err, pel) => {
            if (pel && pel.length > 0) {
                return res.status(200).send({success:false, message: 'La pélicula que intentas registrar ya existe.'})
            } else {
                peli.save((err, peliStore) => {
                    if (err) return res.status(500).send({message: 'Error al guardar la pélicula.'});
                    if (peliStore) {
                        res.status(200).send({
                            success: true,
                            message: 'La pélicula fue registrado con éxito',
                            datos: peliStore
                        });
                    } else {
                        res.status(404).send({message: 'No se ha registrado la pélicula'});
                    }
                });
            }
        }
    )
}

function update(req, res) {
    var pelId = req.params.id;
    var update = req.body;
    Peli.find({title: update.title}, (err, pel) => {
        var pel_isset = false;
        pel.forEach((p) => {
            if (p && p._id != pelId)
                pel_isset = true
        });
        if (pel_isset) return res.status(200).send({
            success: false,
            message: 'El pel que intentas actualizar ya existe.'
        });
        Peli.findByIdAndUpdate(pelId, update, {new: true}, (err, datos) => {
            if (err) return res.status(500).send({success: false, message: 'Error en la peticion.'});
            if (!datos) return res.status(404).send({success: false, message: 'No se ha podido actualizar.'});
            return res.status(200).send({
                pais: datos,
                message: 'La pélicula fue actualizada con éxito',
                success: true
            });
        });
    })
}

function remove(req, res) {
    var pelId = req.params.id;
    Peli.findOne({'_id': pelId}).remove(err => {
        if (err)
            return res.status(500).send({success: false, message: 'Imposible borrar esta pélicula.'});
        return res.status(200).send({success: true, message: 'La pélicula ha sido borrada con éxito.'});
    })
}

function getAll(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 10;
    var query = null;
    if (req.query.active == 'true') {
        query = {active: true}
    }
    Peli.find(query).sort('_id').paginate(page, itemsPerPage, (err, datos, total) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!datos) return res.status(400).send({message: 'No hay peliculas disponibles.'});
        return res.status(200).send({
            datos: datos
        });
    });
}


function getOne(req, res) {
    var pelId = req.params.id;
    Peli.findById(pelId, (err, datos) => {
        if (err)
            return res.status(500).send({message: 'Error en la petición'});
        if (!datos)
            return res.status(404).send({message: 'La pélicula no existe'});
        return res.status(200).send({
            datos: datos
        });
    });
}


module.exports = {
    save,
    getAll,
    getOne,
    update,
    remove
}
