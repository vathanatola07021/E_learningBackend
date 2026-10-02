const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quiz.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/:id/submit', optionalAuth, QuizController.submitQuiz);
router.get('/:id/attempts', optionalAuth, QuizController.getQuizAttempts);
router.get('/:id', optionalAuth, QuizController.getQuizById);

module.exports = router;
