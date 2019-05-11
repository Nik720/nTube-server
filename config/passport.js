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
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { 'error': 'email or password is invalid' });
            }

            return done(null, user);
        }).catch(done);
}));

passport.use(new GoogleStrategy({
            clientID: '390361488631-behji6oe457e84gk2rgjg7556l11ju0j.apps.googleusercontent.com',
            clientSecret: 'jUuHWlAZOSQphi1zv8AXIjPi',
            callbackURL: 'http://localhost:8000/api/auth/google/callback'
        }, async (accessToken, refereshToken, profile, done) => {

        // find current user in UserModel
        const currentUser = await Users.findOne({
            email: profile._json.email
        });

        // create new user if the database doesn't have this user
        if (!currentUser) {
            const newUser = await new Users({
                username : profile._json.name,
                email: profile._json.email
            }).save();
            if (newUser) {
                console.log("User Created...");
                done(null, newUser);
            }
        }
        done(null, currentUser);
    }
));
