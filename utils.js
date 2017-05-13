
var utils = {};

utils.getHashTags = function(str) {
  var hashTags = [];
  //var re = /\#.*?(?=\s|$)/ig;
  var re = /#\w+\b/ig;
  while ((match = re.exec(str)) != null){
  	var hashtag = match[0];
  	hashTags.push(hashtag);
  }	
  return hashTags;
};

module.exports = utils;
