var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ type: 'application/json' }));


var Idea = require('../models/Idea');

router.post('/', function (req, res) {
  Idea.create({
    idea : req.body.idea,
    userId : req.body.userId,
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

router.get('/', function (req, res) {
  Idea.find({}, function (err, ideas) {
    if (err) return res.status(500).send("There was a problem finding the ideas.");
      res.status(200).send(ideas);
  });
});

module.exports = router;