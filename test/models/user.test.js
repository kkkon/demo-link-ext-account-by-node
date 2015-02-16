var crypto = require('crypto');
var mongoose = require('mongoose');
var config = require('config');

require('./../../models/user');

var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
  mongoose.disconnect();
});
db.once('open', function() {
  setTimeout( function() {
    mongoose.disconnect();
  }, 3000 );
});

var User = mongoose.model('User');

function randomValueHex(len) {
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex')
    .slice(0,len);
};

describe('Users', function() {

  before(function() {
    mongoose.connect(config.db.url);
  });

  after(function() {
    mongoose.disconnect();
  });

  it('regist a new user', function(done) {
    var appuid = randomValueHex(8);

    var user = new User({
      uid: appuid
    });
    user.save( function(err) {
      if (err) { console.log(err); }
      done();
    });
  });

  it('load user', function(done) {
    var options = {
      criteria: { 'uid': 1 }
    };
    User.load(options, function(err, data) {
      if (err) { console.log(err); }
      done();
    });
  });

});
