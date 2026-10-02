const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/change-password', optionalAuth, AuthController.changePassword);
router.get('/me', optionalAuth, AuthController.getCurrentUser);

module.exports = router;
