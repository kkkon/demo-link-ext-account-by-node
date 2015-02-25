var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
// models
fs.readdirSync(__dirname + '/models').forEach( function (file) {
  if (~file.indexOf('.js'))
  {
    require(__dirname + '/models/' + file);
  }
});

var config = require('config');

var mongoose = require('mongoose');
var connectMongoDB = function() {
  var env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    mongoose.connection.on('connected', function(err) {
      if (err) { return console.log(err); }
      return console.log('mongoose connected');
    });
  }

  var options = {
    server: {
      socketOptions: { keepAlive: 1 }
    }
  };
  mongoose.connect(config.db.url, options );
};
mongoose.connection.on('error', function(err) {
  if (err) { return console.log(err); }
  return console.log('mongoose error');
});
mongoose.connection.on('disconnected', connectMongoDB);
connectMongoDB();

var passport = require('./controllers/passport');

var routes = require('./routes/index');

var app = express();

var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
var mongoStoreOptions = {
  url: config.db.url
  , collections: config.db.collections_sessions || 'sessions'
  , autoRemove: 'native' //default:'native' use TTL index
  , ttl: 60*60 // default: 14*24*60*60 14 days
};
var expressSessionOptions = {
  secret: 'keyboard cat'
  , cookie: {}
  , resave: true
  , saveUninitialized: true
  //, name: 'connect.sid' // default: 'connect.sid'
  , store: new mongoStore( mongoStoreOptions )
};

if ( 'production' === app.get('env') ) {
  //app.set('trust proxy', 1);

  //expressSessionOptions.cookie.secure = true;

  expressSessionOptions.secret = 'keyboard cat';
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession(expressSessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var controlChecker = require('./controllers/checker');
var csrfState = require('./controllers/csrfstate');

app.use('/amazon/auth', controlChecker.checkSessionParam, csrfState.csrfStateGenerate, function(req, res, next) {
  var csrfstate = req.session.auth_param_state;
  if (csrfstate)
  {
    passport.authenticate('amazon', { state: csrfstate })(req, res, next);
  }
  else
  {
    res.redirect('/error?result=csrfsession');
  }
});

app.use('/amazon/callback', controlChecker.checkSessionParam, csrfState.csrfStateCheck, passport.authenticate('amazon', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect('/finish');
  }
);

app.use('/amazon/revoke', controlChecker.checkSessionParam, function(req, res, next) {
  if ( req.session.appuid )
  {
    if ( req.user )
    {
      if ( req.user.amazon && req.user.amazon.id )
      {
        var mongoose = require('mongoose');
        var UserExtAccount = mongoose.model('UserExtAccount');

        var amazon = {};
        amazon.id = req.user.amazon.id;
        UserExtAccount.revokeExtAccount( req.session.appuid, 'amazon', amazon, function(err,numberAffected) {
          if (err) { console.log(err); }
          res.redirect('/finish');
        });
      }
    }
  }
});

app.use('/google/auth', controlChecker.checkSessionParam, csrfState.csrfStateGenerate, function(req, res, next) {
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

app.use('/google/callback', controlChecker.checkSessionParam, csrfState.csrfStateCheck, passport.authenticate('google-openidconnect', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect('/finish');
  }
);

var googleRevoke = function(req, res, next) {
  var passport = require('passport');
  var mongoose = require('mongoose');
  var UserExtAccount = mongoose.model('UserExtAccount');

  var options = {
    criteria: { 'uid': req.session.appuid }
    , select: 'uid google'
  };
  UserExtAccount.load(options, function(err, data) {
    if (err) { return done(err); }

    console.log('google revoke: data');
    console.log(data);

    var strategy = req._passport.instance._strategy('google-openidconnect');
    console.log('google strategy');
    console.log(strategy);

    strategy.revoke( { accessToken: data.google.accessToken }, function(err, body, res ) {
      console.log('reovke');
      console.log(body);
      console.log(res);
      if (err) { console.log(err); }

      next();
    });
  });
};

app.use('/google/revoke', controlChecker.checkSessionParam, googleRevoke, function(req, res, next) {
  if ( req.session.appuid )
  {
    if ( req.user )
    {
      if ( req.user.google && req.user.google.id )
      {
        var mongoose = require('mongoose');
        var UserExtAccount = mongoose.model('UserExtAccount');

        var google = {};
        google.id = req.user.google.id;
        UserExtAccount.revokeExtAccount( req.session.appuid, 'google', google, function(err,numberAffected) {
          if (err) { console.log(err); }
          res.redirect('/finish');
        });
      }
    }
  }
});



// development
if (app.get('env') === 'development') {
  app.use('/dev/regist', function(req, res, next) {
    var appuid = String(req.query.appuid);
    if (!appuid)
    {
      return res.redirect('error?result=appuid');
    }

    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    User.findOne( { uid: appuid }, function(err, user) {
      if (user)
      {
        console.log('found user');
        return next();
      }
      user = new User({
        uid: appuid
      });
      user.save( function(err) {
        if (err) { console.log(err); }
        console.log('registed user');
        next();
      });
    });
  }
  , function( req, res, next ) {
    return res.redirect('/dev/registed');
  }
  );

  app.use('/dev/registed', function(req, res, next) {
    res.send('registed user');
  });
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
