const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/courses/:courseId', optionalAuth, ProgressController.getCourseProgress);
router.get('/history', optionalAuth, ProgressController.getLearningHistory);

module.exports = router;
