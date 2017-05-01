var express = require('express');
var app = express();

var db = require('./db');

var IdeaController = require('./controllers/IdeaController');
app.use('/ideas', IdeaController);

module.exports = app;