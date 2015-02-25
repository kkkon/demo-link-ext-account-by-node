var express = require('express');

var checkEntryParam = function(req, res, next) {
  var mode;

  if (req.query.mode)
  {
    mode = String(req.query.mode);
    if (
      'link' === mode
      || 'recovery' === mode
    )
    {
      req.session.ext_account_mode = mode;
    }
    else
    {
      mode = null;
    }
  }
  if (!mode)
  {
    return res.redirect('error?result=mode');
  }

  if ( 'link' === mode )
  {
    var appuid;

    if (req.query.appuid)
    {
      appuid = String(req.query.appuid);
      req.session.appuid = appuid;
    }

    if (!appuid)
    {
      return res.redirect('error?result=appuid');
    }
  }

  next();
};

var checkCookie = function(req, res, next) {
  if (req.cookies.checkCookie)
  {
    next();
  }
  else
  {
    res.redirect('/error?result=cookie');
  }
};

var checkSessionParam = function(req, res, next) {
  if ( !req.session.ext_account_mode ) {
    return res.redirect('error?result=sess_mode');
  }

  var mode = req.session.ext_account_mode;

  if ( 'link' === mode )
  {
    if ( !req.session.appuid ) {
      return res.redirect('error?result=sess_appuid');
    }

    return next();
  }
  else
  if ( 'recovery' === mode )
  {
    return next();
  }

  return res.redirect('error?result=sess_mode');
};


var checkAccount = function(req, res, next) {
  if ( !req.session.ext_account_mode ) {
    return res.redirect('error?result=sess_mode');
  }

  var mode = req.session.ext_account_mode;

  if ( 'link' === mode )
  {
    if ( !req.session.appuid ) {
      return res.redirect('error?result=sess_appuid');
    }

    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    var appuid = String(req.session.appuid);
    User.findOne( { uid: appuid }, function(err, user) {
      if (err) { console.log(err); }
      if (!user)
      {
        return res.redirect('error?result=account_notfound');
      }

      {
        req.logout();

        var UserExtAccount = mongoose.model('UserExtAccount');
        var options = {
          criteria: { 'uid': req.session.appuid }
          , select: 'uid amazon.id google.id'
        };
        UserExtAccount.load(options, function(err, data) {
          if (err) { console.log(err); }

          //console.log('load appuid='+req.session.appuid);
          //console.log(data);

          if(!data)
          {
            next();
          }

          console.log('req.logIn:');
          console.log(data);
          req.logIn( data, function(err) {
            if (err) { console.log(err); }

            //console.log( 'req.logIn req.session' );
            //console.log( req.session );
            //console.log( 'req.logIn req.user' );
            //console.log( req.user );
            //console.log( 'req.logIn req._passport.session' );
            //console.log( req._passport.session );

            next();
          });
        });
      }
    });
  }
  else
  if ( 'recovery' === mode )
  {
    return next();
  }
  else
  {
    return res.redirect('error?result=sess_mode');
  }
};

var regenerateSession = function(req, res, next) {
  req.logout();
  req.session.regenerate( function(err) {
    if (err) { console.log(err); }
    next();
  });
};

var checkModeChange = function(req, res, next) {
  var mode = req.session.ext_account_mode;
  if ( 'recovery' !== mode )
  {
    return next();
  }

  if ( req.user )
  {
    if ( req.user.uid )
    {
      req.session.appuid = req.user.uid;
      req.session.ext_account_mode = 'link';
    }
  }

  next();
};

exports.regenerateSession = regenerateSession;
exports.checkEntryParam = checkEntryParam;
exports.checkCookie = checkCookie;
exports.checkSessionParam = checkSessionParam;
exports.checkAccount = checkAccount;
exports.checkModeChange = checkModeChange;

