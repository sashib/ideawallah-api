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

mongoose.model('Idea', ideaSchema);
module.exports = mongoose.model('Idea');
