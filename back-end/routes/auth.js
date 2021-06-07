const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPass, resetPass, updateProfile, getUserProfile,  updateUserProfile} = require('../controllers/authController');
const { isAuthUser, authRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPass);
router.route('/password/reset/:token').put(resetPass);

router.route('/me').get(isAuthUser, getUserProfile);
router.route('/password/update').put(isAuthUser, updateUserProfile);
router.route('/me/update').put(isAuthUser, updateProfile);

router.route('/admin/users').get(isAuthUser, authRoles(admin), allUsers);
module.exports = router; 