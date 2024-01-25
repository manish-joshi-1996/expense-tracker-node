"use strict";

var express = require('express');
var router = express.Router();
var userController = require('../authController');
router.get('/', function (req, res) {
  res.json({
    message: 'Welcome to the expense endpoint'
  });
});
router.post('/signup', userController.signUp);
router.put('/verify-user/:id', userController.verifyOtpAndRegister);
router.post('/send-password-reset-otp', userController.sendPasswordResetOTP);
router.put('/password-reset', userController.resetPassword);
router.post('/login', userController.login);
module.exports = router;