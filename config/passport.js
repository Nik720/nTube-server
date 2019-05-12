const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const TwitterStrategy = require('passport-twitter').Strategy;
const Users = mongoose.model('Users');

// Passport Local Strategy
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

// Passport Google Strategy
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

// Passport Facebook Strategy
passport.use(new FacebookStrategy({
            clientID: '2248341318764911',
            clientSecret: '927e379cd2208d49286f8c1ece6b5e40',
            callbackURL: 'http://localhost:8000/api/auth/facebook/callback'
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

// Passport Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: 'NCaK7wXfy5H89Yf0FFqnUMC3T',
    consumerSecret: 'HyKLU2xlPRaAcUyWx6ChYbAWpaqJmWGvKN9W476nwP02OE86qj',
    callbackURL: '/api/auth/twitter/callback',
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    includeEmail: true
}, async (accessToken, refereshToken, profile, done) => {

    console.log(profile);
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