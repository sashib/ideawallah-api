var mongoose = require('mongoose');
mongoose.connect('mongodb://db:ideasd3v@ds021691.mlab.com:21691/ideasdb', null, function(error) {
  // Check error in initial connection. There is no 2nd param to the callback.
  console.log(error);
});
