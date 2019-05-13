import express from 'express'
import passport from 'passport'
const router = express.Router();
import auth from './auth'

import upload from '../../config/multer.config'
import validator from '../../middleware/validator'
import authCtrl from '../controllers/auth.controller'
import users from '../controllers/users.controller'
import roles from '../controllers/role.controller'
import videos from '../controllers/video.controller'
import reports from '../controllers/reports.controller'

// Auth routes
router.post('/login', auth.optional, authCtrl.login);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', authCtrl.googleSignInCallback);

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', authCtrl.facebookSignInCallback);

router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', authCtrl.twitterSignInCallback);

// Users routes
router.post('/user/register', validator.userRegistrationValidator, auth.optional, users.create);
router.get('/users', [auth.required, auth.isAdminAuthorised], users.findAll);
router.get('/user/:userId', [auth.required, auth.isAdminAuthorised], users.findOne);
router.delete('/user/:userId', [auth.required, auth.isAdminAuthorised], users.delete);
router.put('/user/:userId', [auth.required, auth.isAdminAuthorised], users.update);
router.get('/activeUser', [auth.required], users.getActiveUser);


// Create a new Role
router.post('/roles', [auth.required, auth.isAdminAuthorised], roles.create);
router.get('/roles', [auth.required, auth.isAdminAuthorised], roles.findAll);
router.get('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.findOne);
router.put('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.update);
router.delete('/roles/:roleId', [auth.required, auth.isAdminAuthorised], roles.delete);

// videos routes
router.post('/video/upload', upload.single('file'), validator.validateVideo, auth.required, videos.create);
router.get('/video/:videoId', auth.required, videos.findOne);
router.put('/video/:videoId', auth.required, videos.update);
router.get('/videoPlayback/:videoId', auth.optional, videos.videoPlayback);
router.get('/videos', auth.required, videos.findAll);
router.delete('/video/:videoId', [auth.required, auth.isAdminAuthorised], videos.delete);

// reportsr
router.get('/reports', [auth.required, auth.isAdminAuthorised], reports.basicReports);

module.exports = router;