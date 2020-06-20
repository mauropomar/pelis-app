'use strict'

var express = require('express');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

var app = express();
//cargar rutas
var user_routes = require('./routes/user');
var rol_routes = require('./routes/rol');
var peli_routes = require('./routes/pelis');


//middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas
app.use('/api', user_routes);
app.use('/api', rol_routes);
//app.use('/api', peli_routes);



//exportar

module.exports = app;

