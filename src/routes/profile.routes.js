const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, ProfileController.getProfile);
router.put('/update', optionalAuth, ProfileController.updateProfile);

module.exports = router;
