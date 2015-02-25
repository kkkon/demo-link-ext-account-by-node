var config = require('config');
var mongoose = require('mongoose');

var passport = require('passport');


passport.serializeUser( function(user, done) {
  console.log('passport.serializeUser');
  console.log(user);
  done(null, user.uid);
});

passport.deserializeUser( function(objId, done) {
  console.log('passport.deserializeUser');
  console.log(objId);
  //var mongoose = require('mongoose');
  var UserExtAccount = mongoose.model('UserExtAccount');
  var options = {
    criteria: { uid: objId }
    , select: "uid google.id amazon.id"
  };
  UserExtAccount.load(options, function(err, user) {
    console.log(user);
    done(null, user);
  });
});

var passportCallback = require('../controllers/passportCallback');

var StrategyAmazon = require('passport-amazon').Strategy;
passport.use(new StrategyAmazon({
    clientID: config.amazon.client_id
    , clientSecret: config.amazon.client_secret
    , callbackURL: config.amazon.redirect
    , scope: [ 'profile:user_id' ]
    , skipUserProfile: false
    , passReqToCallback: true
  },
  function( req, accessToken, refreshToken, profile, done ) {
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

          return passportCallback.invoke(req, profile, 'amazon', accessToken, refreshToken, done);
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
    , passReqToCallback: true
  },
  function( req, iss, sub, profile, accessToken, refreshToken, done ) {
    process.nextTick( function() {
      return passportCallback.invoke(req, profile, 'google', accessToken, refreshToken, done);
    });
  }
));


exports = module.exports = passport;
