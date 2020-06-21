'use strinct'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');


//metodo de login
function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err, user) => {
            if (err) return res.status(500).send({message: 'Error de peticion'});
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            //devolver  y generar token
                            res.status(200).send({
                                user: user,
                                token: jwt.createToken(user),
                            });
                        }
                    } else {
                        return res.status(404).send({message: 'Usuario y/o contraseña incorrecta.'})
                    }
                })
            } else {
                return res.status(404).send({message: 'El usuario no se ha podido identificar!!!'})
            }
        }
    ).populate('sucursal')
}

//salva los datos de un usuario
function save(req, res) {
    var params = req.body;
    var user = new User();
    if (params.rol != '1') {
        user.name = params.name;
        user.username = params.username;
        user.email = params.email;
        user.phone = params.phone;
        user.rol = params.rol;
        user.adreess = params.adreess;
        user.image = null;
        User.find({
            $or: [{email: user.email.toLowerCase()},
                {username: user.username.toLowerCase()}]
        }).exec((err, users) => {
                if (err) return res.status(500).send({success: false, message: 'Error en la petición de usuarios.'});
                if (users && users.length > 1) {
                    return res.status(200).send({success: false, message: 'El usuario que intentas registrar ya existe.'})
                } else {
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        user.save((err, userStore) => {
                            if (err) return res.status(500).send({message: 'Error al guardar el usuario'});
                            if (userStore) {
                                res.status(200).send({
                                    user: userStore,
                                    message: 'El usuario fue registrado con éxito',
                                    success: true
                                });
                            } else {
                                res.status(404).send({message: 'No se ha registrado el usuario'});
                            }
                        });
                    });
                }
            }
        )
    } else {
        res.status(200).send({
            message: 'Envia todos los campos necesarios'
        });
    }
}

//-----------------------------------------------------------------------------------------------------//
//editar los datos del usuario
function updatePerfil(req, res) {
    var userId = req.params.id;
    var update = req.body;
    User.find({
        $or: [{email: update.email.toLowerCase()},
            {username: update.username.toLowerCase()}]
    }).exec((err, users) => {
        var user_isset = false;
        users.forEach((user) => {
            if (user && user._id != userId)
                user_isset = true
        });
        if (user_isset) return res.status(200).send({
            success: false,
            message: 'El perfil que intentas actualizar ya existe.'
        });
        bcrypt.hash(update.password, null, null, (err, hash) => {
            var password = (update.password_anterior != update.password) ? hash : update.password;
            var user = {
                name: update.name,
                username: update.username,
                email: update.email,
                image: update.image,
                adreess:  update.adreess,
                phone: update.phone,
                password: password
            };
            User.findByIdAndUpdate(userId, user, {new: true}, (err, data) => {
                if (err) return res.status(500).send({success: false, message: 'Error en la peticion.'});
                if (!data) return res.status(404).send({
                    success: false,
                    message: 'No se ha podido actualizar.'
                });
                return res.status(200).send({
                    user: data,
                    message: 'El perfil fue actualizado con éxito',
                    success: true
                });
            });
        });
    });
}


//-----------------------------------------------------------------------------------------------------//
//editar los datos del usuario
function update(req, res) {
    var userId = req.params.id;
    var update = req.body;
    User.find({
        $or: [{email: update.email.toLowerCase()},
            {username: update.username.toLowerCase()}]
    }).exec((err, users) => {
        var user_isset = false;
        users.forEach((user) => {
            if (user && user._id != userId)
                user_isset = true
        });
        if (user_isset) return res.status(200).send({
            success: false,
            message: 'El usuario que intentas actualizar ya existe.'
        });
        bcrypt.hash(update.password, null, null, (err, hash) => {
            var password = (update.password_anterior != update.password) ? hash : update.password;
            var user = {
                name: update.name,
                username: update.username,
                email: update.email,
                phone: update.phone,
                rol: update.rol,
                adreess: update.adreess,
                image: update.image,
                password: password
            };
            User.findByIdAndUpdate(userId, user, {new: true}, (err, data) => {
                if (err) return res.status(500).send({success: false, message: 'Error en la peticion.'});
                if (!data) return res.status(404).send({
                    success: false,
                    message: 'No se ha podido actualizar.'
                });
                return res.status(200).send({
                    user: data,
                    message: 'El usuario fue actualizado con éxito',
                    success: true
                });
            });
        });
    });
}


//metodo que devuelve un usuario determninado
//----------------------------------------User---------------------------------------//
function getOne(req, res) {
    var userId = req.params.id;
    User.findById(userId, (err, datos) => {
        if (err)
            return res.status(500).send({message: 'Error en la petición'});
        if (!datos)
            return res.status(404).send({message: 'El usuario no existe'});
        var array = new Array({
            _id: datos['_id'],
            name: datos['name'],
            username: datos['username'],
            email: datos['email'],
            phone: datos['phone'],
            adreess: datos['adreess'],
            rol: datos['rol'],
            password: datos['password'],
            image: datos['image']
        });
        return res.status(200).send({datos: array});
    });
}

//-----------------------------------Users-------------------------------------------------//
//metodo que devuelve un listado de usuarios paginados
function getAll(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 10;
    User.find().sort('_id').populate('rol', 'name').paginate(page, itemsPerPage, (err, datos, total) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!datos) return res.status(400).send({message: 'No hay usuarios disponibles.'});
        return res.status(200).send({
            datos,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

//--------------------------------------Upload image----------------------------------------------//

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        //  console.log(file_path);
        var file_split = file_path.split('\\');
        //   console.log(file_split);
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        //     console.log(ext_split);
        var file_ext = ext_split[1];
        //     console.log(file_ext);
        /*  if (userId != req.user.sub) {
              return removeFilePathUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario.');
          }*/
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
            //Actualizar documento usuario logueado
            User.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, datos) => {
                if (err) return res.status(500).send({message: 'Error en la peticion.'});
                if (!datos) return res.status(404).send({message: 'No se ha podido actualizar.'});
                return res.status(200).send({user: datos});
            })
        } else {
            return removeFilePathUploads(res, file_path, 'Extensión no válida.');
        }
    } else {
        return res.status(200).send({message: 'No se han subido imagenes.'});
    }
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

function removeFilePathUploads(res, filepath, message) {
    fs.unlink(filepath, (err) => {
        return res.status(200).send({message: message});
    })
}

function remove(req, res) {
    var userId = req.params.id;
    User.findOne({'_id': userId}).remove(err => {
        if (err)
            return res.status(500).send({success: false, message: 'Imposible borrar este usuario.'});
        return res.status(200).send({success: true, message: 'El usuario ha sido borrado con éxito.'});
    })
}

module.exports = {
    save,
    login,
    getOne,
    getAll,
    update,
    updatePerfil, 
    uploadImage,
    getImageFile,
    remove,
}
