const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  	Users.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { 'error': 'email or password is invalid' } );
      }

      return done(null, user);
    }).catch(done);
}));

passport.use(new GoogleStrategy({
  clientID: '390361488631-behji6oe457e84gk2rgjg7556l11ju0j.apps.googleusercontent.com',
  clientSecret: 'jUuHWlAZOSQphi1zv8AXIjPi',
  callbackURL: 'http://localhost:8000/api/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  Users.findOne({email: profile._json.email},function(err,usr) {
    usr.token = accessToken;
    usr.save(function(err,usr,num) {
      if(err)	{
        console.log('error saving token');
      }
    });
    process.nextTick(function() {
      return done(null,profile);
    });
  });
  }
));