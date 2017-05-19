/*
mongoose.connect('mongodb://db:ideasd3v@ds021691.mlab.com:21691/ideasdb', null, function(error) {
  // Check error in initial connection. There is no 2nd param to the callback.
  console.log(error);
});
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var mongoURI = {
  //aws version: production: 'mongodb://db:ideasd3v@ds021691.mlab.com:21691/ideasdb',
  production: 'mongodb://db:id3asdb@ds064299.mlab.com:64299/ideawallahdb',
  //production: 'mongodb://ideawallahdb:LZfikYbGjBdQksTlYp7f4v5SjIHN3GwAEkQX2ED0BNKvPlw9jpzA9rsfPIhBNHGPALJ7R7iqlzmQ1Zc9LPSyjw==@ideawallahdb.documents.azure.com:10255/ideawallahdb?ssl=true&replicaSet=globaldb',
  //dev: 'mongodb://dbdev:dbdev@ds137291.mlab.com:37291/ideasdbdev',
  //test: 'mongodb://dbtest:dbtest@ds139761.mlab.com:39761/ideasdbtest'
  development: 'mongodb://127.0.0.1/ideasdev',
  test: 'mongodb://127.0.0.1/ideastest'
};

mongoose.connect(mongoURI[process.env.NODE_ENV], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + mongoURI[process.env.NODE_ENV]);
  }
});