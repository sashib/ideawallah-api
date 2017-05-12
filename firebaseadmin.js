var admin = require("firebase-admin");

var serviceAccount = require("./ideawallah-firebase-adminsdk-7ronn-48cf1d8c7b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ideawallah.firebaseio.com"
});

module.exports = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    admin.auth().verifyIdToken(token)
      .then(function(decodedToken) {
        var uid = decodedToken.uid;
        req.uid = uid;
        return next();
      }).catch(function(error) {
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });          
      });

  } else {
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });    
  }
}
