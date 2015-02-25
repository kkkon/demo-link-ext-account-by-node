var express = require('express');
var router = express.Router();

var passport = require('../controllers/passport');

var controlChecker = require('../controllers/checker');
var csrfState = require('../controllers/csrfstate');
var actionRevoke = require('../controllers/actionRevoke');

router.get('/auth'
  , controlChecker.checkSessionParam
  , csrfState.csrfStateGenerate
  , function(req, res, next) {
  var csrfstate = req.session.auth_param_state;
  if (csrfstate)
  {
    passport.authenticate('google-openidconnect', { state: csrfstate })(req, res, next);
  }
  else
  {
    res.redirect('/error?result=csrfsession');
  }
});

router.get('/callback'
  , controlChecker.checkSessionParam
  , csrfState.csrfStateCheck
  , passport.authenticate('google-openidconnect', { failureRedirect: '/fail' })
  , function(req, res) {
    res.redirect('/finish');
  }
);

router.get('/revoke'
  , controlChecker.checkSessionParam
  , actionRevoke.googleTokenRevoke
  , actionRevoke.googleRevoke
  , function(req, res) {

  res.redirect('/finish');
});




module.exports = router;
