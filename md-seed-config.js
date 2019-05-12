var mongooseLib = require('mongoose');
const dbConfig = require('./config/database.config');
var Users = require("./seeders/users.seeder");
var Roles = require("./seeders/users.seeder");

mongooseLib.Promise = global.Promise || Promise;

module.exports = {

  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL: process.env.MONGO_URL || dbConfig.url,

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Roles,
    Users
  }
};
