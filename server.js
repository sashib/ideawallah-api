var app = require('./app');

var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  app.listen(port, function() {
    console.log('listening on 3000');
  });
});
*/

