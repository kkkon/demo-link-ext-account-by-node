var express = require('express');
var router = express.Router();

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

router.get('/', checkEntryParam, function(req, res, next) {
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
