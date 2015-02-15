var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.cookie('checkCookie', 1 );

  res.redirect('checkCookie');

});

/* check cookie */
router.get('/checkCookie', function(req, res, next) {
  if (req.cookies.checkCookie)
  {
    res.redirect('index');
  }
  else
  {
    res.redirect('/error?result=cookie');
  }
});

/* GET home page. */
router.get('/index', function(req, res, next) {
  if (req.cookies.checkCookie)
  {
    res.render('index', { title: 'Express' });
  }
  else
  {
    res.redirect('/error?result=cookie');
  }
});

module.exports = router;
