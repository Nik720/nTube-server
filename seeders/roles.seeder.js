var Seeder = require('mongoose-data-seed').Seeder;
var Model = require('../app/models/role.model');

var data = [
  {
    name: 'Admin'
  },
  {
    name: 'Public'
  }
];

var RolesSeeder = Seeder.extend({
  shouldRun: function () {
    return Model.countDocuments().exec().then(count => count === 0);
  },
  run: function () {
    return Model.create(data);
  }
});

module.exports = RolesSeeder;
