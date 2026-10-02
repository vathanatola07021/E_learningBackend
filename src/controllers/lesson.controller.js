const LessonService = require('../services/lesson.service');
const QuizService = require('../services/quiz.service');
const ApiResponse = require('../utils/apiResponse');

class LessonController {
  static async getLessonById(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.user ? req.user.id : req.query.studentId;
      const lesson = await LessonService.getLessonById(id, studentId);
      res.json(ApiResponse.success(lesson, 'Lesson fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }

  static async markLessonCompleted(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.body.studentId || (req.user ? req.user.id : 'usr_student_01');
      const courseId = req.body.courseId || req.query.courseId;
      await LessonService.markLessonCompleted(id, studentId, courseId);
      res.json(ApiResponse.success(null, 'Lesson marked as completed'));
    } catch (error) {
      next(error);
    }
  }

  static async getQuizByLesson(req, res, next) {
    try {
      const { lessonId } = req.params;
      const quiz = await QuizService.getQuizByLesson(lessonId);
      res.json(ApiResponse.success(quiz, 'Quiz fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }
}

module.exports = LessonController;
