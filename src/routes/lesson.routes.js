const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lesson.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/:lessonId/quiz', optionalAuth, LessonController.getQuizByLesson);
router.post('/:id/complete', optionalAuth, LessonController.markLessonCompleted);
router.get('/:id', optionalAuth, LessonController.getLessonById);

module.exports = router;
