const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');

router.post('/signup', userController.signUp);
router.put('/verify-user/:id', userController.verifyOtpAndRegister);
router.post('/send-password-reset-otp', userController.sendPasswordResetOTP);
router.put('/password-reset', userController.resetPassword);
router.post('/login', userController.login);

module.exports = router;
