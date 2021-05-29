const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPass, resetPass } = require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPass);
router.route('/password/reset/:token').put(resetPass);



module.exports = router; 