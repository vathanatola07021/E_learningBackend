const QuizService = require('../services/quiz.service');
const ApiResponse = require('../utils/apiResponse');

class QuizController {
  static async getQuizById(req, res, next) {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id);
      res.json(ApiResponse.success(quiz, 'Quiz fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }

  static async submitQuiz(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.body.studentId || (req.user ? req.user.id : 'usr_student_01');
      const selectedAnswers = req.body.selectedAnswers || {};
      const attempt = await QuizService.submitQuizAttempt({
        quizId: id,
        studentId,
        selectedAnswers,
      });
      res.status(201).json(ApiResponse.success(attempt, 'Quiz submitted successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }

  static async getQuizAttempts(req, res, next) {
    try {
      const { id } = req.params;
      const attempts = await QuizService.getQuizAttempts(id);
      res.json(ApiResponse.success(attempts, 'Quiz attempts fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = QuizController;
