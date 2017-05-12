var morgan = require('morgan');
var express = require('express');
var db = require('./db');
//var auth = require('./auth');
var auth = require('./firebaseadmin');
var bodyParser = require('body-parser');
var Idea = require('./models/Idea');
var User = require('./models/User');
var Tag = require('./models/Tag');

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));


// ***************************************************

app.post('/ideas', auth, function (req, res) {
  Idea.create({
    idea : req.body.idea,
    userId : req.uid,
    tags : req.body.tags,
    meta : req.body.meta,
    comments : req.body.comments,
    hidden : req.body.hidden

  }, 
  function (err, idea) {
      if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(idea);
    });
});

app.get('/ideas/public', function (req, res) {
  Idea.find({}, function (err, ideas) {
    if (err) return res.status(500).send("There was a problem finding the ideas.");
    res.status(200).send(ideas);
  });
});

app.get('/ideas/public/:tag', function (req, res) {
  Idea.findByTagPublic(req.params.tag, function (err, ideas) {
    if (err) return res.status(500).send("There was a problem finding the ideas.");
    res.status(200).send(ideas);
  });
});

app.get('/ideas', auth, function (req, res) {
  //console.log(req.uid);
  Idea.findByUserId(req.uid, function (err, ideas) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
    res.status(200).send(ideas);
  });
});

app.get('/ideas/:tag', auth, function (req, res) {
  //console.log(req.uid);
  Idea.findByTag(req.uid, req.params.tag, function (err, ideas) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
    res.status(200).send(ideas);
  });
});


// ***************************************************

app.post('/tags', auth, function (req, res) {
  Tag.create({
    tag : req.body.tag,
    userId : req.uid
  }, 
  function (err, tag) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(tag);
    });
});

app.get('/tags/public', function (req, res) {
  Tag.find({}, function (err, tags) {
    if (err) return res.status(500).send("There was a problem finding the ideas.");
    res.status(200).send(tags);
  });
});

app.get('/tags', auth, function (req, res) {
  console.log(req.uid);
  Tag.findByUserId(req.uid, function (err, tags) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
      res.status(200).send(tags);
  });
});

// ***************************************************


app.post('/users', auth, function (req, res) {
  //console.log(req.uid);
  User.findByUserId(req.uid, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
    if (user.length > 0) res.status(403).send("User already exists");
  });

  User.create({
    name : req.body.name,
    userId : req.uid,
    email : req.body.email
  }, 
  function (err, user) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
    res.status(200).send("Successfully created user");
  });
});

app.delete('/users', auth, function(req, res) {
  //console.log(req.uid);
  User.remove({ userId: req.uid }, function (err) {
    if (err) return res.status(500).send("There was a problem deleting the information from the database.");
    res.status(200).send("User removed Successfully");
  });
});

app.get('/users', auth, function (req, res) {
  //console.log(req.uid);
  User.findByUserId(req.uid, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    res.status(200).send(user);
  });
});


module.exports = app;