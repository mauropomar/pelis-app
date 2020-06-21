'use strict'

var express = require('express');
var PeliController = require('../controllers/pelis');
var multipart = require('connect-multiparty');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();
api.post('/register-peli', md_auth.ensureAuth, PeliController.save);
api.get('/pelis/:page?',md_auth.ensureAuth, PeliController.getAll);
api.get('/search-pelis',md_auth.ensureAuth, PeliController.search);
api.get('/peli/:id', md_auth.ensureAuth, PeliController.getOne);
api.put('/update-peli/:id', md_auth.ensureAuth, PeliController.update);
api.delete('/delete-peli/:id', md_auth.ensureAuth, PeliController.remove);

module.exports = api;