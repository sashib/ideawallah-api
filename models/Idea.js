var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ideaSchema = new Schema({
  idea:  String,
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
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  },  
  tags: { 
    type: [String], 
    index: true 
  }
});

ideaSchema.static('findByUserId', function (uid, callback) {
  //console.log("uid is: " + uid);
  return this.find({ userId: uid }, callback);
});

ideaSchema.static('findByTag', function(uid, tag, callback) {
  //console.log("uid is: " + uid + ", tag is: " + tag);
  return this.find({userId: uid, tags: { $in: [tag]}}, callback);
})

ideaSchema.static('findByTagPublic', function(uid, tag, callback) {
  //console.log("tag is: " + tag);
  return this.find({public: true, tags: { $in: [tag]}}, callback);
})

mongoose.model('Idea', ideaSchema);
module.exports = mongoose.model('Idea');
