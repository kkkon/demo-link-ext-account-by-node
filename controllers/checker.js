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

exports.checkEntryParam = checkEntryParam;
exports.checkCookie = checkCookie;
exports.checkSessionParam = checkSessionParam;

