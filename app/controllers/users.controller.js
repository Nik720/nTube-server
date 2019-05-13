const passport = require('passport');
const Users = require('../models/Users.js');
const config = require('../../config/constant');

//POST new user route (optional, everyone has access)
exports.create = (req, res, next) => {

  const user = req.body.user;

  let newUser = {
    username : user.name,
    email: user.email,
    password: user.password
  }

  if(user.role) {
    newUser.role = user.role;
  }

  const finalUser = new Users(newUser);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.send({ user: finalUser.toAuthJSON() }))
    .catch((err) => {
      if (err.name == 'ValidationError') {
          console.error('Error Validating!', err);
          res.status(422).json(err);
      } else {
          console.error(err);
          res.status(500).json(err);
      }
    });
};

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

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  Users.find().select("-hash").select('-salt').sort({createdAt: 'desc'})
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    });
};

/**
* Which is used to find user by id.
* @param {object} req
* @param {object} res
* @return {object} - Response object.
*/
exports.findOne = (req, res) => {
  Users.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Usert not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

/**
* Which is used to update user data.
* @param {object} req
* @param {object} res
* @return {object} - Response object.
*/
exports.update = (req, res) => {

    const user = req.body.user;

    if(!user.role) {
      return res.status(422).send({
        errors: {
          role: 'is required',
        },
      });
    }

    let newUser = {
      username : user.name,
      email: user.email,
      role: user.role
    }

    if(user.password) {
      Users.setPassword(user.password);
    }

    // Find user and update it with the request body
    Users.findByIdAndUpdate(req.params.userId, newUser)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.userId
        });
    });
};

//DELETE User
exports.delete = (req, res) => {
  Users.findByIdAndRemove(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "user not found with id " + req.params.userId
            });
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.userId
        });
    });
};

exports.getActiveUser = (req, res) => {
    const user = Users().returnActiveUser(req);
    res.json(user);
}
