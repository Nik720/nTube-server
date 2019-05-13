import mongoose from 'mongoose'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'
import FacebookStrategy from 'passport-facebook'
const TwitterStrategy = require('passport-twitter').Strategy;
import KEYS from './constant'
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
            clientID: KEYS.SOCIAL_KEYS.GOOGLE.CLIENT_ID,
            clientSecret: KEYS.SOCIAL_KEYS.GOOGLE.CLIENT_SECRET,
            callbackURL: KEYS.SOCIAL_KEYS.GOOGLE.CALLBACK
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
            clientID: KEYS.SOCIAL_KEYS.FACEBOOK.CLIENT_ID,
            clientSecret: KEYS.SOCIAL_KEYS.FACEBOOK.CLIENT_SECRET,
            callbackURL: KEYS.SOCIAL_KEYS.FACEBOOK.CALLBACK
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
    consumerKey: KEYS.SOCIAL_KEYS.TWITTER.CLIENT_ID,
    consumerSecret: KEYS.SOCIAL_KEYS.TWITTER.CLIENT_SECRET,
    callbackURL: KEYS.SOCIAL_KEYS.TWITTER.CALLBACK,
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