const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPass, resetPass, updateProfile, getUserProfile,  updatePassword, allUsers, getUserDetails, updateUser, deleteUser} = require('../controllers/authController');
const { isAuthUser, authRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPass);
router.route('/password/reset/:token').put(resetPass);

router.route('/me').get(isAuthUser, getUserProfile);
router.route('/password/update').put(isAuthUser, updatePassword);
router.route('/me/update').put(isAuthUser, updateProfile);

router.route('/admin/users').get(isAuthUser, authRoles('admin'), allUsers);
router.route('/admin/user/:id').get(isAuthUser, authRoles('admin'), getUserDetails);
router.route('/admin/user/:id').put(isAuthUser, authRoles('admin'), updateUser);
router.route('/admin/user/:id').delete(isAuthUser, authRoles('admin'), deleteUser);


module.exports = router; 