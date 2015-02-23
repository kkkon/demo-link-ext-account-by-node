var express = require('express');
var router = express.Router();

var controlChecker = require('../controllers/checker');

router.get('/', controlChecker.checkEntryParam, function(req, res, next) {
  res.cookie('checkCookie', 1 );

  res.redirect('checkCookie');

});

/* check cookie */
router.get('/checkCookie', controlChecker.checkCookie, function(req, res, next) {
  res.redirect('index');
});

/* GET home page. */
router.get('/index', controlChecker.checkCookie, controlChecker.checkSessionParam, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
