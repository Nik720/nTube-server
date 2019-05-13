import passport from 'passport'
import Users from '../models/Users.js'
import config from '../../config/constant'


//POST login route (optional, everyone has access)
exports.login = (req, res, next) => {
    const user = req.body;
    if(!user.email) {
      return res.status(422).send({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!user.password) {
      return res.status(422).send({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }

      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.send({ user: user.toAuthJSON() });
      } else {
        res.status(400).send({
            message: info || "Some error occurred while creating the Role."
        });
      }
    })(req, res, next);
};

exports.googleSignInCallback = (req, res, next) => {
    passport.authenticate('google',function(err, user, info) {
        if(err) {
            return next(err);
    }
    const userDetail = user.toAuthJSON();
    if(!user) {
    return res.redirect(`${config.CLIENT_URL}auth/fail`);
    }
    return res.redirect(`${config.CLIENT_URL}auth/success?clientToken=`+userDetail.token);
    })(req,res,next);
};

exports.facebookSignInCallback = (req, res, next) => {
    passport.authenticate('facebook',function(err, user, info) {
        if(err) {
            return next(err);
    }
    const userDetail = user.toAuthJSON();
    if(!user) {
    return res.redirect(`${config.CLIENT_URL}auth/fail`);
    }
    return res.redirect(`${config.CLIENT_URL}auth/success?clientToken=`+userDetail.token);
    })(req,res,next);
};

exports.twitterSignInCallback = (req, res, next) => {
    passport.authenticate('twitter',function(err, user, info) {
        if(err) {
            return next(err);
    }
    const userDetail = user.toAuthJSON();
    if(!user) {
    return res.redirect(`${config.CLIENT_URL}auth/fail`);
    }
    return res.redirect(`${config.CLIENT_URL}auth/success?clientToken=`+userDetail.token);
    })(req,res,next);
};