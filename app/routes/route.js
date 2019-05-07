const express = require('express');
const router = express.Router();
const auth = require('./auth');
let upload = require('../../config/multer.config');
let validator = require('../../middleware/validator');

const users = require('../controllers/users.controller.js');
const roles = require('../controllers/role.controller.js');
const videos = require('../controllers/video.controller.js');

// Auth routes
router.post('/login', auth.optional, users.login);
router.post('/user/register', auth.optional, users.create);

// Users routes
router.get('/users', [auth.required, auth.isAdminAuthorised], users.findAll);
router.get('/user/:userId', [auth.required, auth.isAdminAuthorised], users.findOne);
router.delete('/user/delete/:userId', [auth.required, auth.isAdminAuthorised], users.delete);
router.put('/user/:userId', [auth.required, auth.isAdminAuthorised], users.update);


// Create a new Role
router.post('/roles', [auth.required, auth.isAdminAuthorised], roles.create);
router.get('/roles', [auth.required, auth.isAdminAuthorised], roles.findAll);
router.get('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.findOne);
router.put('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.update);
router.delete('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.delete);


// videos routes
router.post('/video/upload', upload.single('file'), validator.validateVideo, auth.required, videos.create);
router.get('/videoPlayback/:videoId', auth.optional, videos.findOne);
router.get('/videos', auth.required, videos.findAll);

module.exports = router;