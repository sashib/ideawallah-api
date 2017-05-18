var morgan = require('morgan');
var express = require('express');
var db = require('./db');
//var auth = require('./auth');
var auth = require('./firebaseadmin');
var bodyParser = require('body-parser');
var Idea = require('./models/Idea');
var User = require('./models/User');
var Hashtag = require('./models/Hashtag');
var utils = require('./utils');

var app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));


// ***************************************************

var IDEA_QUERY_LIMIT = 2;
var IDEA_QUERY_SORT_ORDER = {created: -1};

function addIdea(userId, str, callback) {
  var hashtags = [];

  var idea = new Idea();
  idea.userId = userId;
  idea.idea = str;
  idea.hashtags = hashTagHelper.getHashTags(str);
  idea.save(callback);  
};

function find(userId, searchTxt, page, callback) {
  if (page == null)
    page = 0;
  
  if (searchTxt != null && searchTxt != '') {
    Idea.find({$text: {$search: searchTxt}})
    .where('userId').equals(userId)
    .limit(ideaRouter.IDEA_QUERY_LIMIT)
    .skip(ideaRouter.IDEA_QUERY_LIMIT * page)
    .sort(ideaRouter.IDEA_QUERY_SORT_ORDER)
    .exec(callback);
  } else {
    Idea.find()
    .where('userId').equals(userId)
    .limit(ideaRouter.IDEA_QUERY_LIMIT)
    .skip(ideaRouter.IDEA_QUERY_LIMIT * page)
    .sort(ideaRouter.IDEA_QUERY_SORT_ORDER)
    .exec(callback);
  }

};

function getTodayIdeas(sender, senderSource, cb) {
  var d1 = new Date();
  d1.setUTCHours(0,0,0,0);
  var d2 = new Date();
  d2.setUTCHours(24,0,0,0);

  Idea.count({"created": {"$gte": d1, "$lt": d2}, "userId": sender, "userSource": senderSource}, function(err, c) {
    console.log('Count is ' + c);
    if (c <= 1) {
      txt = messageHelper.ADDED_IDEA_TODAY;
    } else {
      txt = messageHelper.ADDED_IDEAS_TODAY;
    }
    cb(sender, c + txt);
  });

};

app.post('/ideas', auth, function (req, res) {
  var idea = req.body.idea;
  var uid = req.uid;
  var hashtags = utils.getHashTags(idea);
  Idea.create({
    idea : idea,
    userId : uid,
    hashtags : hashtags,
    public : req.body.public

  }, 
  function (err, idea) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
    for (i=0; i<hashtags.length; i++) {
      var query = { hashtag: hashtags[i], userId: uid };
      var dt = new Date();
	    //Hashtag.findOneAndUpdate(query, { $inc: {count:1}, userId: req.uid }, {upsert: true}, function(err, hashtag) {
	      //if (err) return res.status(500).send("There was a problem adding the information to the database.");
	    //});
	    Hashtag.update(query, { $inc: {count:1}, userId: uid, date: dt }, {upsert: true}, function(err, hashtag) {
	      //if (err) return res.status(500).send("There was a problem adding the information to the database.");
	    });
    }
    res.status(200).send(idea);
  });
});

app.get('/ideas/public', function (req, res) {
  Idea.findPublic(function (err, ideas) {
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
  var limit = parseInt(req.query.limit);
  var page = parseInt(req.query.page);
  Idea.findByUserId(req.uid, limit, page, function (err, ideas) {
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

app.delete('/ideas', auth, function(req, res) {
  Idea.remove({ userId: req.uid }, function (err) {
    if (err) return res.status(500).send("There was a problem deleting the information from the database.");
    res.status(200).send("Ideas removed Successfully");
  });	
})


// ***************************************************

app.post('/hashtags', auth, function (req, res) {
  Hashtag.create({
    hashtag : req.body.hashtag,
    userId : req.uid
  }, 
  function (err, hashtag) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
      res.status(200).send(hashtag);
    });
});

app.get('/hashtags/public', function (req, res) {
  Hashtag.find({}, function (err, hashtags) {
    if (err) return res.status(500).send("There was a problem finding the ideas.");
    res.status(200).send(hashtags);
  });
});

app.get('/hashtags', auth, function (req, res) {
  //console.log(req.uid);
  Hashtag.findByUserId(req.uid, function (err, hashtags) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
      res.status(200).send(hashtags);
  });
});

app.delete('/hashtags', auth, function(req, res) {
  Hashtag.remove({ userId: req.uid }, function (err) {
    if (err) return res.status(500).send("There was a problem deleting the information from the database.");
    res.status(200).send("Hashtags removed Successfully");
  });	
})

// ***************************************************


app.post('/users', auth, function (req, res) {
  console.log("creating user, uid is: " + req.uid);
  User.findByUserId(req.uid, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the ideas for user.");
    console.log("user length is: " + user.length);
    if (user.length > 0) res.status(200).send(user);
  });

  User.create({
    name : req.body.name,
    userId : req.uid,
    email : req.body.email
  }, 
  function (err, user) {
    if (err) return res.status(500).send("There was a problem adding the information to the database.");
    res.status(200).send(user);
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