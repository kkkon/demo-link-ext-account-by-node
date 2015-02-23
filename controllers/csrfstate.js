var express = require('express');

var csrfStateGenerate = function(req, res, next) {
  var crypto = require('crypto');
  var csrfstate = crypto.randomBytes(16).toString('base64');
  req.session.auth_param_state = csrfstate;

  console.log('state pre :' + csrfstate);
  next();
};

var csrfStateCheck = function(req, res, next) {
  var csrfstate = req.session.auth_param_state;
  req.session.auth_param_state = null;
  delete req.session.auth_param_state;

  console.log('state post:' + csrfstate);
  if ( req.query.state != csrfstate )
  {
    res.redirect('/error?result=csrf');
  }
  else
  {
    next();
  }
};

exports.csrfStateGenerate = csrfStateGenerate;
exports.csrfStateCheck = csrfStateCheck;

