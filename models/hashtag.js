var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LIMIT = 25;
var SORT_ORDER = {date: -1};

var hashtagSchema = new Schema({
  hashtag:  String,
  userId: String,
  count: Number,
  date: { 
    type: Date, 
    default: Date.now 
  }
});

hashtagSchema.static('findByUserId', function (uid, limit, page, callback) {
  limit = limit || LIMIT;
  page =  page || 0;
  return this.find()
    .where('userId').equals(uid)
    .limit(limit)
    .skip(limit * page)
    .sort(SORT_ORDER)
    .exec(callback);
});

module.exports = mongoose.model('Hashtag', hashtagSchema);
