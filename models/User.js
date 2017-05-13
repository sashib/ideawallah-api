var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email:  String,
  userId: String,
  created: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.static('findByUserId', function (uid, callback) {
  //console.log("uid is: " + uid);
  return this.find({ userId: uid }, callback);
});

userSchema.static('findByUserEmail', function (email, callback) {
  //console.log("email is: " + email);
  return this.find({ email: email }, callback);
});


module.exports = mongoose.model('User', userSchema);