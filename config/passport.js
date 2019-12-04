/* eslint-disable linebreak-style */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const User = require('../models/users');
require('dotenv').config();

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
}, ((accessToken, refreshToken, profile, done) => done(null, profile))));
passport.use(new GoogleTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
},
((accessToken, refreshToken, profile, done) => done(null, profile))));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
((email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    }).catch(done);
})));
