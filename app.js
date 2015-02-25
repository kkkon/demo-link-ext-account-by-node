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
var routesAmazon = require('./routes/amazon');
var routesGoogle = require('./routes/google');

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
app.use('/amazon', routesAmazon);
app.use('/google', routesGoogle);



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
