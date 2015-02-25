var express = require('express');

var amazonRevoke = function(req, res, next) {
  if ( req.session.appuid )
  {
    if ( req.user )
    {
      if ( req.user.amazon && req.user.amazon.id )
      {
        var mongoose = require('mongoose');
        var UserExtAccount = mongoose.model('UserExtAccount');

        var amazon = {};
        amazon.id = req.user.amazon.id;
        UserExtAccount.revokeExtAccount( req.session.appuid, 'amazon', amazon, function(err,numberAffected) {
          if (err) { console.log(err); }
          next();
        });
      }
    }
  }
};

var googleTokenRevoke = function(req, res, next) {
  var mongoose = require('mongoose');
  var UserExtAccount = mongoose.model('UserExtAccount');

  var options = {
    criteria: { 'uid': req.session.appuid }
    , select: 'uid google'
  };
  UserExtAccount.load(options, function(err, data) {
    if (err) { return done(err); }

    console.log('google revoke: data');
    console.log(data);

    var strategy = req._passport.instance._strategy('google-openidconnect');
    console.log('google strategy');
    console.log(strategy);

    strategy.revoke( { accessToken: data.google.accessToken }, function(err, body, res ) {
      console.log('reovke');
      console.log(body);
      console.log(res);
      if (err) { console.log(err); }

      next();
    });
  });
};

var googleRevoke = function(req, res, next) {
  if ( req.session.appuid )
  {
    if ( req.user )
    {
      if ( req.user.google && req.user.google.id )
      {
        var mongoose = require('mongoose');
        var UserExtAccount = mongoose.model('UserExtAccount');

        var google = {};
        google.id = req.user.google.id;
        UserExtAccount.revokeExtAccount( req.session.appuid, 'google', google, function(err,numberAffected) {
          if (err) { console.log(err); }
          next();
        });
      }
    }
  }
};

exports.amazonRevoke = amazonRevoke;
exports.googleTokenRevoke = googleTokenRevoke;
exports.googleRevoke = googleRevoke;
