const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('./auth');
let upload = require('../../config/multer.config');
let validator = require('../../middleware/validator');

const users = require('../controllers/users.controller');
const roles = require('../controllers/role.controller');
const videos = require('../controllers/video.controller');
const reports = require('../controllers/reports.controller');

// Auth routes
router.post('/login', auth.optional, users.login);
router.post('/user/register', validator.userRegistrationValidator, auth.optional, users.create);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', users.googleSignInCallback);

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', users.facebookSignInCallback);

router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', users.twitterSignInCallback);

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
router.delete('/video/:videoId', [auth.required, auth.isAdminAuthorised], videos.delete);

// reportsr
router.get('/reports', [auth.required, auth.isAdminAuthorised], reports.basicReports);

module.exports = router;