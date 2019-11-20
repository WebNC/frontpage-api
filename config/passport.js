const passport    = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const FacebookTokenStrategy = require('passport-facebook-token')
var User = require("../models/users")
// var GoogleTokenStrategy = require('passport-google-token').Strategy;

// passport.use(new FacebookTokenStrategy({
//   clientID: Key.FACEBOOK_APP_ID,
//   clientSecret: Key.FACEBOOK_APP_SECRET
// }, function(accessToken, refreshToken, profile, done) {
//   return done(null,profile)
// }
// ));
// passport.use(new GoogleTokenStrategy({
//   clientID: Key.GOOGLE_CLIENT_ID,
//   clientSecret: Key.GOOGLE_CLIENT_SECRET
// },
// function(accessToken, refreshToken, profile, done) {
//   return done(null,profile)
// }
// ));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
      User.findOne({ email })
      .then((user) => {
          if (!user || !user.validatePassword(password)) {
              return done(null, false, { errors: { 'email or password': 'is invalid' } });
          }
          return done(null, user);
      }).catch(done);
    }
));
