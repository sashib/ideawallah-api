var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  tag:  String,
  userId: String,
  count: Number,
  publicCount: Number, 
  date: { 
    type: Date, 
    default: Date.now 
  },
});

tagSchema.static('findByUserId', function (uid, callback) {
  console.log("uid is: " + uid);
  return this.find({ userId: uid }, callback);
});

module.exports = mongoose.model('Tag', tagSchema);
