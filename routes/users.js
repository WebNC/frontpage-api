/* eslint-disable linebreak-style */
const express = require('express');

const router = express.Router();
const auth = require('../config/auth');
const userControllers = require('../controllers/userControllers');

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// 3.1
router.post('/login', auth.optional, userControllers.login);

// 3.2
router.post('/register', auth.optional, userControllers.register);
router.post('/register-teacher', auth.optional, userControllers.registerTeacher);

// 3.5 - 4.3 - 4.5 - 5.4
router.get('/me', auth.required, userControllers.me);

// none
router.post('/login/facebook', userControllers.loginFacebook);
router.post('/login/google', userControllers.loginGoogle);

// 4.2
router.post('/change-pass', userControllers.changePass);

// 3.3
router.get('/verified-account/:token', userControllers.verifiedAccount);

// 3.6
router.get('/verified-account-forget/:token', userControllers.verifiedAccountForget);
router.post('/forget-password/send-email', userControllers.forgetPassword);
router.post('/forget-password/reset-password', userControllers.resetPassword);

// 5.1
router.post('/edit', userControllers.edit);

router.get('/contract/read/:id', userControllers.readContract);

module.exports = router;
