var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config');
var passport = require('passport');

passport.serializeUser( function(user, done) {
  console.log('passport.serializeUser');
  console.log(user);
  done(null, user);
});

passport.deserializeUser( function(obj, done) {
  console.log('passport.deserializeUser');
  done(null, obj);
});

var StrategyAmazon = require('passport-amazon').Strategy;
passport.use(new StrategyAmazon({
    clientID: config.amazon.client_id
    , clientSecret: config.amazon.client_secret
    , callbackURL: config.amazon.redirect
    , scope: [ 'profile:user_id' ]
    , skipUserProfile: false
  },
  function( accessToken, refreshToken, profile, done ) {
    process.nextTick( function() {
      var strategy = passport._strategy('amazon');
      //console.log('amazon strategy');
      //console.log(strategy);
      strategy._oauth2.get('https://api.amazon.com/auth/O2/tokeninfo', accessToken, function(err,body,res) {
        if (err) { return strategy.error(new InternalOAuthError('failed to fetch tokeninfo', err)); }

        try {
          var json = JSON.parse(body);
          console.log('amazon tokeninfo');
          console.log(json);

          if ( json.iss != 'https://www.amazon.com' )
          {
            return strategy.error(new InternalOAuthError('validate error. issuer not match: ' + json.iss, err));
          }
          if ( json.aud != strategy._oauth2._clientId )
          {
            return strategy.error(new InternalOAuthError('validate error. audience not match: ' + json.aud, err));
          }

          var epoch_exp = json.iat + json.exp;
          var epoch = Math.round(new Date()/1000);
          //console.log( 'exp  =' + epoch_exp );
          //console.log( 'epoch=' + epoch );
          if ( epoch_exp < epoch )
          {
            return strategy.error(new InternalOAuthError('validate error. expired: ' + epoch_exp, err));
          }

          return done(null, profile);
        } catch(e) {
          done(e);
        }
      });
    });
  }
));

var StrategyGoogle = require('passport-google-openidconnect').Strategy;
passport.use(new StrategyGoogle({
    clientID: config.google.client_id
    , clientSecret: config.google.client_secret
    , callbackURL: config.google.redirect
    , skipUserProfile: true
  },
  function( iss, sub, profile, accessToken, refreshToken, done ) {
    process.nextTick( function() {
      return done(null, profile);
    });
  }
));

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.use('/amazon/auth', passport.authenticate('amazon'));

app.use('/amazon/callback', passport.authenticate('amazon', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect('/finish');
  }
);


app.use('/google/auth', passport.authenticate('google-openidconnect'));

app.use('/google/callback', passport.authenticate('google-openidconnect', { failureRedirect: '/fail' }),
  function(req, res) {
    res.redirect('/finish');
  }
);



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
