
var utils = {};

utils.getHashTags = function(str) {
  var hashTags = [];
  //var re = /\#.*?(?=\s|$)/ig;
  var re = /#\w+\b/ig;
  while ((match = re.exec(str)) != null){
  	var hashtag = match[0];
  	hashTags.push(hashtag.substr(1,hashtag.length));
  }	
  return hashTags;
};

module.exports = utils;
