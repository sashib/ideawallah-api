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



var token, token2;
var testUserId, testUserId2;

var testEmail = "tester@appwallah.com";
var testPswd = "tester";
var testName = "tester";

var testEmail2 = "secondtester@appwallah.com";
var testPswd2 = "tester";
var testName2 = "second tester";

/*
before(function (done) {
  //create first test user
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

  //create 2nd test user
  firebase.auth().createUserWithEmailAndPassword(testEmail2, testPswd2).then(function(user) {
	testUserId2 = user.uid;
    user.getToken(false).then(function(accessToken) {
    	token2 = accessToken;
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
*/

describe('app test', function() {

  describe('create first test firebase user', function() {
    it('successfully create test user in firebase', function(done) {
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
  });

  describe('create first test user in db', function() {
    it('respond with 200 and successfully created user', function(done) {
      request(app)
        .post('/users')
        .send({ email: testEmail, name: testName, userId: testUserId })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.text.should.equal('Successfully created user');
          done();
        });
    });
  });

  describe('create a new PRIVATE idea for first test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "new #amazing #test private idea", public: false })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          res.body.date.should.be.ok();
          done();
        });
    });
  });

  describe('create a 2nd PRIVATE idea for first test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "new #amazing idea about water conservation #eco", public: false })
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

  describe('create a new PUBLIC idea for first test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "remove corner three #nba #test public idea", meta: {votes:5, favs:3}, public: true })
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

  describe('create a 2nd PUBLIC idea for first test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "app to come with #ideas #tech #startups", meta: {votes:5, favs:3}, public: true })
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

  describe('get ALL ideas for first test user for limit 3 and page 0', function() {
    it('respond with 200 and json of 3 ideas', function(done) {
      request(app)
        .get('/ideas?limit=3&page=0')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(3);
          done();
        });
    });
  });

  describe('get ALL ideas for first test user for limit 3 and page 1', function() {
    it('respond with 200 and json of 3 ideas', function(done) {
      request(app)
        .get('/ideas?limit=3&page=1')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          done();
        });
    });
  });

  describe('get ideas with hashtag #eco for first test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/eco')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          res.body[0].hashtags.should.containEql("eco");
          done();
        });
    });
  });

  describe('get ideas with hashtag that doesn not exist for first test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/blahblah')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(0);
          done();
        });
    });
  });

  describe('create 2nd test firebase user', function() {
    it('successfully create 2nd test user in firebase', function(done) {
      firebase.auth().createUserWithEmailAndPassword(testEmail2, testPswd2).then(function(user) {
	    testUserId2 = user.uid;
        user.getToken(false).then(function(accessToken) {
    	  token2 = accessToken;
    	  done();
        });
      }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        done(error);
      });
    });
  });  

describe('create a new PRIVATE idea for 2nd test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "an #eco idea for 2nd test user", public: false })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token2)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          res.body.date.should.be.ok();
          done();
        });
    });
  });

  describe('create a 2nd PRIVATE idea for 2nd test user in db', function() {
    it('respond with 200 and successfully created idea', function(done) {
      request(app)
        .post('/ideas')
        .send({ idea: "a #brand new idea for 2nd user", public: false })
        .set('Accept', 'application/json')
        .set('X-Access-Token', token2)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  });  

  describe('get ideas with hashtag #eco for 2nd test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/eco')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token2)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          res.body[0].hashtags.should.containEql("eco");
          res.body[0].idea.should.eql("an #eco idea for 2nd test user");
          done();
        });
    });
  });

  describe('get ALL ideas for 2nd test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token2)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(2);
          done();
        });
    });
  });
  
  describe('get ideas for user not in system', function() {
    it('respond with 403', function(done) {
      request(app)
        .get('/ideas')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403, done);
    });
  });  

  describe('get ALL PUBLIC ideas for 2nd test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token2)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          //console.log(res.body);
          if (err) return done(err);
          res.body.length.should.eql(2);
          done();
        });
    });
  });

  describe('get ALL PUBLIC ideas with hashtag #tech for first test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public/tech')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          res.body[0].hashtags.should.containEql('tech');
          done();
        });
    });
  });  

  describe('get ALL PUBLIC ideas with hashtag that does not exist for first test user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public/amazing')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(0);
          done();
        });
    });
  });

  describe('get ALL PUBLIC ideas for unauthenticated user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          //console.log(res.body);
          if (err) return done(err);
          res.body.length.should.eql(2);
          done();
        });
    });
  });

  describe('get ALL PUBLIC ideas with hashtag #test for unauthenticated user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public/test')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(1);
          res.body[0].hashtags.should.containEql('test');
          done();
        });
    });
  });  

  describe('get ALL PUBLIC ideas with hashtag that does not exist for unauthenticated user', function() {
    it('respond with 200 and json of ideas', function(done) {
      request(app)
        .get('/ideas/public/surf')
        .set('Accept', 'application/json')
        .set('X-Access-Token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.length.should.eql(0);
          done();
        });
    });
  });

  describe('delete all ideas by new user', function() {
    it('respond with 200 and successfully deleted ideas for new user', function(done) {
      request(app)
        .delete('/ideas')
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

  describe('delete all ideas by unauthorized user', function() {
    it('respond with 403', function(done) {
      request(app)
        .delete('/ideas')
        .set('Accept', 'application/json')
        .set('X-Access-Token', "somebadtoken-adfasdfasdf")
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  });

  describe('delete first test user from db', function() {
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
  });

  describe('delete the 2nd test user from firebase', function() {
    it('should delete 2nd test user from firebase', function(done) {
      firebase.auth().currentUser.delete().then(function() {
  	    //console.log('deleted test user');
  	    done();
      }, function(error) {
  	    done(error);
      });
    });
  });


  describe('delete the first test user from firebase', function() {
    it('should login and delete first test user from firebase', function(done) {
      firebase.auth().signInWithEmailAndPassword(testEmail, testPswd).then(function(user) {
        user.delete().then(function() {
  	      //console.log('deleted test user');
  	      done();
        }, function(error) {
  	      done(error);
        });
  	  });
    }, function(error) {
  	    done(error);
    });
    
  });

  describe('delete user by unauthorized user', function() {
    it('respond with 403', function(done) {
      request(app)
        .delete('/users')
        .set('Accept', 'application/json')
        .set('X-Access-Token', "somebadtoken-adfasdfasdf")
        .expect(403)
        .end(function(err, res) {
          if (err) return done(err);
          //res.text.should.equal('Successfully created user');
          done();
        });
    });
  });

});





