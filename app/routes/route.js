const express = require('express');
const router = express.Router();
const auth = require('./auth');

const users = require('../controllers/users.controller.js');
const roles = require('../controllers/role.controller.js');

// Auth routes
router.post('/login', auth.optional, users.login);

// Users routes
router.post('/user/register', auth.optional, users.create);
router.get('/users',[auth.required, auth.isAdminAuthorised], users.findAll);
router.get('/user/:userId',[auth.required, auth.isAdminAuthorised], users.findOne);
router.delete('/user/delete/:userId',[auth.required, auth.isAdminAuthorised], users.delete);


// Create a new Role
router.post('/roles',[auth.required, auth.isAdminAuthorised], roles.create);
// Retrieve all Roles
router.get('/roles',[auth.required, auth.isAdminAuthorised], roles.findAll);
// Retrieve a single Role with roleId
router.get('/roles/:roleId',[auth.required, auth.isAdminAuthorised], roles.findOne);
// Update a Role with roleId
router.put('/roles/:roleId',[auth.required, auth.isAdminAuthorised], roles.update);
// Delete a Role with roleId
router.delete('/roles/:roleId',[auth.required, auth.isAdminAuthorised], roles.delete);




module.exports = router;