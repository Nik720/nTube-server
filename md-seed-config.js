var mongooseLib = require('mongoose');
var Users = require("./seeders/users.seeder");

mongooseLib.Promise = global.Promise || Promise;

module.exports = {

  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/ntube-test',

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Users
  }
};
