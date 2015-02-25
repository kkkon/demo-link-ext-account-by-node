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
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/finish', function(req, res, next) {
  res.render('finish');
});

module.exports = router;
