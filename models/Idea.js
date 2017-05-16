var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IDEA_QUERY_LIMIT = 3;
var IDEA_QUERY_SORT_ORDER = {date: -1};

var ideaSchema = new Schema({
  idea:  {
    type: String,
    index: true
  },
  userId: String,
  comments: [
    { 
      userId: String,
      body: String, 
      date: {type: Date, default: Date.now} 
    }
  ],
  date: { 
    type: Date, 
    default: Date.now 
  },
  public: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  },  
  hashtags: { 
    type: [String], 
    index: true 
  }
});

ideaSchema.static('findByUserId', function (uid, limit, page, callback) {
  //console.log("uid is: " + uid);
  //return this.find({ userId: uid }, callback);
  limit = limit || IDEA_QUERY_LIMIT;
  page =  page || 0;
  return this.find()
    .where('userId').equals(uid)
    .limit(limit)
    .skip(limit * page)
    .sort(IDEA_QUERY_SORT_ORDER)
    .exec(callback);
});

ideaSchema.static('findByTag', function(uid, tag, callback) {
  //console.log("uid is: " + uid + ", tag is: " + tag);
  return this.find({userId: uid, hashtags: { $in: [tag]}}, callback);
});

ideaSchema.static('findByTagPublic', function(tag, callback) {
  //console.log("tag is: " + tag);
  return this.find({public: true, hashtags: { $in: [tag]}}, callback);
});

ideaSchema.static('findPublic', function(callback) {
  //console.log("tag is: " + tag);
  return this.find({public: true}, callback);
});


module.exports = mongoose.model('Idea', ideaSchema);