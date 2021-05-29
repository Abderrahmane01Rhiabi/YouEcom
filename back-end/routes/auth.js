const express = require('express');
const router = express.Router();

const { registerUser, loginUser, logout, forgotPass } = require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPass);

module.exports = router; 