var express = require('express');
var router = express.Router();

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

router.get('/', function(req, res, next) {
  res.cookie('checkCookie', 1 );

  res.redirect('checkCookie');

});

/* check cookie */
router.get('/checkCookie', checkCookie, function(req, res, next) {
  res.redirect('index');
});

/* GET home page. */
router.get('/index', checkCookie, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
