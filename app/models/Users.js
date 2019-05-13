import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import constant from '../../config/constant'

var UsersSchema = mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  hash: String,
  salt: String,
  role: {
    type: String,
    default: 'public'
  }
}, {timestamps: true});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    role: this.role,
    username: this.username,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, constant.SECRET);
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    name: this.username,
    email: this.email,
    role: this.role,
    token: this.generateJWT(),
  };
};

UsersSchema.methods.validateUniqeEmail = async (value) => {
  const emailCount = await mongoose.models.Users.countDocuments({email: value });
  return (emailCount == 0) ? false : true;
};

UsersSchema.methods.findUserIdByAuthorization = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    let token = authorization.split(' ')[1];
    var decoded = jwt.verify(token, constant.SECRET);
    return (decoded) ? decoded.id : false;
  }
};

UsersSchema.methods.returnActiveUser = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    let token = authorization.split(' ')[1];
    var decoded = jwt.verify(token, constant.SECRET);
    return (decoded) ? decoded : false;
  }
};

module.exports = mongoose.model('Users', UsersSchema);