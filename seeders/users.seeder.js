var Seeder = require('mongoose-data-seed').Seeder;
var Model = require('../app/models/Users');

let newUser = {
  username : 'admin2',
  email: 'admin2@admin.com',
  password: '123',
  role: 'admin'
}

const finalUser = new Model(newUser);
finalUser.setPassword(newUser.password);

var data = [
  finalUser
];

var UsersSeeder = Seeder.extend({
  shouldRun: function () {
    console.log("In Should run");
    //return Model.countDocuments().exec().then(count => count === 0);
    return true;
  },
  run: function () {
    return Model.create(data);
  }
});

module.exports = UsersSeeder;
