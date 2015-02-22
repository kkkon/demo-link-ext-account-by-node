var crypto = require('crypto');
var mongoose = require('mongoose');
var config = require('config');
var async = require('async');

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

  it('load user', function(done) {
    var options = {
      criteria: { 'google.id': 1 }
    };
    UserExtAccount.load(options, function(err, data) {
      if (err) { console.log(err); }
      done();
    });
  });

  it('linkExtAccount amazon', function(done) {
    var appuid = randomValueHex(8);
    var aid = randomValueHex(10);

    async.series([
      function(callback) {
        var user = new UserExtAccount({
          uid: appuid
        });
        user.save( function(err) {
          if (err) { console.log(err); }
          callback(null, 'done');
        });
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var amazon = {}
          var amazonid = aid;
          amazon.id = amazonid;
          if ( accessToken ) { amazon.accessToken = accessToken; }
          if ( refreshToken ) { amazon.refreshToken = refreshToken; }
          data.amazon = amazon;
          UserExtAccount.linkExtAccount( appuid, 'amazon', data.amazon, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var amazon = {}
          var amazonid = aid;
          amazon.id = amazonid;
          accessToken = randomValueHex(9);
          if ( accessToken ) { amazon.accessToken = accessToken; }
          if ( refreshToken ) { amazon.refreshToken = refreshToken; }
          data.amazon = amazon;
          UserExtAccount.linkExtAccount( appuid, 'amazon', data.amazon, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var amazon = {}
          var amazonid = aid;
          amazon.id = amazonid;
          refreshToken = randomValueHex(9);
          if ( accessToken ) { amazon.accessToken = accessToken; }
          if ( refreshToken ) { amazon.refreshToken = refreshToken; }
          data.amazon = amazon;
          UserExtAccount.linkExtAccount( appuid, 'amazon', data.amazon, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var amazon = {}
          var amazonid = aid;
          amazon.id = amazonid;
          accessToken = randomValueHex(9);
          refreshToken = randomValueHex(9);
          if ( accessToken ) { amazon.accessToken = accessToken; }
          if ( refreshToken ) { amazon.refreshToken = refreshToken; }
          data.amazon = amazon;
          UserExtAccount.linkExtAccount( appuid, 'amazon', data.amazon, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
    ]
    , function(err, results) {
      if (err) { console.log(err); }
      console.log(results);
      done();
    });

  });


  it('linkExtAccount google', function(done) {
    var appuid = randomValueHex(8);
    var aid = randomValueHex(10);

    async.series([
      function(callback) {
        var user = new UserExtAccount({
          uid: appuid
        });
        user.save( function(err) {
          if (err) { console.log(err); }
          callback(null, 'done');
        });
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var google = {}
          var googleid = aid;
          google.id = googleid;
          if ( accessToken ) { google.accessToken = accessToken; }
          if ( refreshToken ) { google.refreshToken = refreshToken; }
          data.google = google;
          UserExtAccount.linkExtAccount( appuid, 'google', data.google, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var google = {}
          var googleid = aid;
          google.id = googleid;
          accessToken = randomValueHex(9);
          if ( accessToken ) { google.accessToken = accessToken; }
          if ( refreshToken ) { google.refreshToken = refreshToken; }
          data.google = google;
          UserExtAccount.linkExtAccount( appuid, 'google', data.google, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var google = {}
          var googleid = aid;
          google.id = googleid;
          refreshToken = randomValueHex(9);
          if ( accessToken ) { google.accessToken = accessToken; }
          if ( refreshToken ) { google.refreshToken = refreshToken; }
          data.google = google;
          UserExtAccount.linkExtAccount( appuid, 'google', data.google, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
      ,
      function(callback) {
        var data = {};
        var accessToken;
        var refreshToken;
        {
          var google = {}
          var googleid = aid;
          google.id = googleid;
          accessToken = randomValueHex(9);
          refreshToken = randomValueHex(9);
          if ( accessToken ) { google.accessToken = accessToken; }
          if ( refreshToken ) { google.refreshToken = refreshToken; }
          data.google = google;
          UserExtAccount.linkExtAccount( appuid, 'google', data.google, function(err,numberAffected) {
            if (err) { console.log(err); }
            //console.log(data);
            callback(null, 'done');
          });
        }
      }
    ]
    , function(err, results) {
      if (err) { console.log(err); }
      console.log(results);
      done();
    });

  });

});
