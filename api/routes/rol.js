'use strict'

var express = require('express');
var RolController = require('../controllers/rol');
var multipart = require('connect-multiparty');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();
api.post('/register-rol', md_auth.ensureAuth, RolController.save);
api.get('/rols/:page?',md_auth.ensureAuth, RolController.getAll);
api.get('/rol/:id', md_auth.ensureAuth, RolController.getOne);
api.put('/update-rol/:id', md_auth.ensureAuth, RolController.update);
api.delete('/delete-rol/:id', md_auth.ensureAuth, RolController.remove);

module.exports = api;
