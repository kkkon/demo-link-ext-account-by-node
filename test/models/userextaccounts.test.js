var crypto = require('crypto');
var mongoose = require('mongoose');
var config = require('config');

require('./../../models/userextaccount');

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

var UserExtAccount = mongoose.model('UserExtAccount');

function randomValueHex(len) {
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex')
    .slice(0,len);
};

function randomValueDec(len) {
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('dec');
};

describe('UserExtAccounts', function() {

  before(function() {
    mongoose.connect(config.db.url);
  });

  after(function() {
    mongoose.disconnect();
  });


  it('regist a new user', function(done) {
    var appuid = randomValueHex(8);
    var aid = randomValueHex(10);

    var user = new UserExtAccount({
      uid: appuid
      , google: { id: aid }
    });
    user.save( function(err) {
      if (err) { console.log(err); }
      done();
    });
  });

});
