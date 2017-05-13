/*
mongoose.connect('mongodb://db:ideasd3v@ds021691.mlab.com:21691/ideasdb', null, function(error) {
  // Check error in initial connection. There is no 2nd param to the callback.
  console.log(error);
});
*/
var mongoose = require('mongoose');

var mongoURI = {
  prod: 'mongodb://db:ideasd3v@ds021691.mlab.com:21691/ideasdb',
  dev: 'mongodb://dbdev:dbdev@ds137291.mlab.com:37291/ideasdbdev',
  test: 'mongodb://dbtest:dbtest@ds139761.mlab.com:39761/ideasdbtest'
};

mongoose.connect(mongoURI[process.env.NODE_ENV], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + mongoURI[process.env.NODE_ENV]);
  }
});