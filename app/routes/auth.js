const jwt = require('express-jwt');
const jwtWeb = require('jsonwebtoken');
const constant = require('../../config/constant');

const getTokenFromHeaders = (req,res) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const checkForAdminAuthorization = (req,res,next) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    let token = authorization.split(' ')[1];
    var decoded = jwtWeb.verify(token, constant.SECRET);
    if(decoded.role.toLowerCase() == 'admin') {
      return next();
    } else {
      return res.status(401).send({
          message: "Not Authorised to Access this Route"
      });
    }
  }
}

const auth = {
  required: jwt({
    secret: constant.SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: constant.SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  isAdminAuthorised: checkForAdminAuthorization
};

module.exports = auth;