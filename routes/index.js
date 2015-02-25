var express = require('express');
var router = express.Router();

var controlChecker = require('../controllers/checker');

router.get('/'
  , controlChecker.regenerateSession
  , controlChecker.checkEntryParam
  , function(req, res, next) {
  res.cookie('checkCookie', 1 );

  res.redirect('checkCookie');

});

/* check cookie */
router.get('/checkCookie'
  , controlChecker.checkCookie
  , controlChecker.checkAccount
  , function(req, res, next) {
  res.redirect('index');
});

/* GET home page. */
router.get('/index'
  , controlChecker.checkCookie
  , controlChecker.checkSessionParam
  , controlChecker.checkModeChange
  , function(req, res, next) {
  console.log( 'req.session' );
  console.log( req.session );
  console.log( 'req.user' );
  console.log( req.user );

  var mode = req.session.ext_account_mode;
  if ( 'link' === mode )
  {
    res.render('index', { title: 'Express', user: req.user });
  }
  else
  if ( 'recovery' === mode )
  {
    res.render('index_recovery', { title: 'Express', user: req.user });
  }
  else
  {
    res.redirect('/error?result=mode');
  }
});

router.get('/finish', function(req, res, next) {
  var mode = req.session.ext_account_mode;
  if ( 'link' === mode )
  {
    res.render('finish');
  }
  else
  if ( 'recovery' === mode )
  {
    res.render('finish_recovery');
  }
  else
  {
    res.redirect('/error?result=mode');
  }
});

module.exports = router;
