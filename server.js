/*
var app = require('./app');

var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

*/

var app = require('./app');

// below will redirect http to https
app.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'prod') {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
      var host = req.get('Host');
      var url = req.url;
      res.redirect('https://' + host + url);
    }
    else {
      next();
    }
  } else {
    next();  	
  }
});

app.set('port', process.env.PORT || 3000);

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV != 'test') {
  app.listen(app.get('port'));
}

console.log('Node ready to rock. Listening on port ' + app.get('port'));

