const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const constant = require('../../config/constant');

var UsersSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9 ]+$/, 'is invalid']
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
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

UsersSchema.path('email').validate(async (value) => {
  const emailCount = await mongoose.models.Users.countDocuments({email: value });
  return !emailCount;
}, 'Email already exists');

module.exports = mongoose.model('Users', UsersSchema);