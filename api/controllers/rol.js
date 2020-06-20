'use strinct'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Rol = require('../models/rol');

function save(req, res) {
    var params = req.body;
    var role = new Rol();
    role.name = params.name;
    role.description = params.description;
    role.active = true;
    Rol.find({name: params.name},(err, rol) => {
            if (rol && rol.length > 0) {
                return res.status(200).send({success:false, message: 'El rol que intentas registrar ya existe.'})
            } else {
                role.save((err, roleStore) => {
                    if (err) return res.status(500).send({message: 'Error al guardar el rol.'});
                    if (roleStore) {
                        res.status(200).send({
                            success: true,
                            message: 'El rol fue registrado con éxito',
                            datos: roleStore
                        });
                    } else {
                        res.status(404).send({message: 'No se ha registrado el rol'});
                    }
                });
            }
        }
    )
}

//-----------------------------------------------------------------------------------------------------//
//editar los datos del usuario
function update(req, res) {
    var rolId = req.params.id;
    var update = req.body;
    Rol.find({name: update.name}, (err, rol) => {
        var rol_isset = false;
        rol.forEach((p) => {
            if (p && p._id != rolId)
                rol_isset = true
        });
        if (rol_isset) return res.status(200).send({
            success: false,
            message: 'El rol que intentas actualizar ya existe.'
        });
        Rol.findByIdAndUpdate(rolId, update, {new: true}, (err, datos) => {
            if (err) return res.status(500).send({success: false, message: 'Error en la peticion.'});
            if (!datos) return res.status(404).send({success: false, message: 'No se ha podido actualizar.'});
            return res.status(200).send({
                pais: datos,
                message: 'El rol fue actualizada con éxito',
                success: true
            });
        });
    })
}

function remove(req, res) {
    var rolId = req.params.id;
    Rol.findOne({'_id': rolId}).remove(err => {
        if (err)
            return res.status(500).send({success: false, message: 'Imposible borrar este rol.'});
        return res.status(200).send({success: true, message: 'El rol ha sido borrado con éxito.'});
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
    Rol.find(query).sort('_id').paginate(page, itemsPerPage, (err, datos, total) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!datos) return res.status(400).send({message: 'No hay roles disponibles.'});
        return res.status(200).send({
            datos: datos
        });
    });
}


function getOne(req, res) {
    var rolId = req.params.id;
    Rol.findById(rolId, (err, datos) => {
        if (err)
            return res.status(500).send({message: 'Error en la petición'});
        if (!datos)
            return res.status(404).send({message: 'El usuario no existe'});
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
