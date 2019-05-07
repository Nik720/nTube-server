const passport = require('passport');
const Users = require('../models/Users.js');

//POST new user route (optional, everyone has access)
exports.create = (req, res, next) => {

  const user = req.body.user;

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

//GET current route (required, only authenticated users have access)
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

exports.update = (req, res) => {

    const user = req.body.user;
	  // Validate Request
    if(!user.email) {
      return res.status(422).send({
        errors: {
          email: 'is required',
        },
      });
    }

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

    // Find role and update it with the request body
    Users.findByIdAndUpdate(req.params.userId, { newUser }, {new: true})
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

//DELETE current route (required, only authenticated users have access)
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
