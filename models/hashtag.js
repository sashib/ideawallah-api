var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hashtagSchema = new Schema({
  hashtag:  String,
  userId: String,
  count: Number,
  date: { 
    type: Date, 
    default: Date.now 
  }
});

hashtagSchema.static('findByUserId', function (uid, callback) {
  console.log("uid is: " + uid);
  return this.find({ userId: uid }, callback);
});

module.exports = mongoose.model('Hashtag', hashtagSchema);
