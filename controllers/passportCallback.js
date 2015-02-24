//var express = require('express');

var mongoose = require('mongoose');
var UserExtAccount = mongoose.model('UserExtAccount');


var link = function( req, profile, provider, accessToken, refreshToken, done ) {
  var options = {
    critedia: { 'uid': req.session.appuid }
    , select: 'uid ' + provider
  };
  UserExtAccount.load(options, function(err, data) {
    if (err) { return done(err); }
    if (data)
    {
      {
        data[provider] = {};
        data[provider].id = profile.id;
        if ( accessToken ) { data[provider].accessToken = accessToken; }
        if ( refreshToken ) { data[provider].refreshToken = refreshToken; }
        UserExtAccount.linkExtAccount( req.session.appuid, provider, data[provider], function(err,numberAffected) {
          if (err) { return done(err); }
          return done(null, data);
        });
      }
    }
    else
    {
      data = {};
      {
        data[provider] = {};
        data[provider].id = profile.id;
        if ( accessToken ) { data[provider].accessToken = accessToken; }
        if ( refreshToken ) { data[provider].refreshToken = refreshToken; }

        var doc = {}
        doc.uid = req.session.appuid;
        doc[provider] = data[provider];
        data = new UserExtAccount(doc);
        data.save( function(err) {
          if (err) { return done(err); }
          return done(null, data);
        });
      }
    }
  });
};

var recover = function( req, profile, provider, accessToken, refreshToken, done ) {
  var options = {
    criteria: {}
    , select: 'uid ' + provider
  };
  options.criteria[provider+'.id'] = user.id;
  UserExtAccount.load(options, function(err, data) {
    if (err) { return done(err); }
    if (data)
    {
      if ( data[provider] && data[provider].id )
      {
        req.session.appuid = profile.uid;
        data[provider] = {};
        data[provider].id = user.id;
        if ( accessToken ) { data[provider].accessToken = accessToken; }
        if ( refreshToken ) { data[provider].refreshToken = refreshToken; }
        UserExtAccount.linkExtAccount( req.session.appuid, provider, data[provider], function(err,numberAffected) {
          if (err) { return done(err); }
          return done(null, data);
        });
      }
      else
      {
        return done(err, data);
      }
    }
    else
    {
      return done(null);
    }
  });
};

var passportCallback = function( req, profile, provider, accessToken, refreshToken, done ) {
  var mode = req.session.ext_account_mode;
  if ( 'link' === mode )
  {
    return link(req, profile, provider, accessToken, refreshToken, done);
  }
  else
  if ( 'recover' === mode )
  {
    return recover(req, profile, provider, accessToken, refreshToken, done);
  }
};

exports.invoke = passportCallback;

