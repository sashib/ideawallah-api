var request = require("supertest");
var should = require("should");
var app = require("../app");
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAyZElbyw2WsnB2MzKsgAOanyOztu5ozwM",
    authDomain: "ideawallah.firebaseapp.com",
    databaseURL: "https://ideawallah.firebaseio.com",
    projectId: "ideawallah",
    storageBucket: "ideawallah.appspot.com",
    messagingSenderId: "14039170492"
  };
firebase.initializeApp(config);



var token;

var testUserId;
var testEmail = "tester@appwallah.com";
var testPswd = "tester";
var testName = "tester";


before(function (done) {
  firebase.auth().createUserWithEmailAndPassword(testEmail, testPswd).then(function(user) {
	testUserId = user.uid;
    user.getToken(false).then(function(accessToken) {
    	token = accessToken;
    	done();
    });
  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    done(error);
  });

});

after(function (done) {
  firebase.auth().currentUser.delete().then(function() {
  	//console.log('deleted test user');
  	done();
  }, function(error) {
  	done(error);
  });
});

describe('new user workflow', function() {
  describe('create new user in db', function() {
    it('respond with 200 and successfully created user', function(done) {
      request(app)
        .post('/users')
        .send({ email: testEmail, name: testName, userId: testUserId })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  });

  describe('create a new idea for new user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "new #amazing #test idea", tags: ["amazing","test"], meta: {votes:5, favs:3}, hidden: false })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect(200)
        .end(function(err, res) {
          console.log(res.body);
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  });

  describe('get ideas for new user', function() {
    it('respond with json', function(done) {
      request(app)
        .get('/ideas')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('delete the new user', function() {
    it('respond with 200 and successfully deleted user', function(done) {
      request(app)
        .delete('/users')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  })
});





