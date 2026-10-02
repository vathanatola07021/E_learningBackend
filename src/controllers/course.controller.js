const CourseService = require('../services/course.service');
const LessonService = require('../services/lesson.service');
const AssignmentService = require('../services/assignment.service');
const ApiResponse = require('../utils/apiResponse');

class CourseController {
  static async getCourses(req, res, next) {
    try {
      const userId = req.user ? req.user.id : req.query.studentId;
      const courses = await CourseService.getCourses(userId);
      res.json(ApiResponse.success(courses, 'Courses fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async searchCourses(req, res, next) {
    try {
      const { q, categoryId, level, sortBy } = req.query;
      const userId = req.user ? req.user.id : req.query.studentId;
      const courses = await CourseService.searchCourses({ query: q, categoryId, level, sortBy }, userId);
      res.json(ApiResponse.success(courses, 'Courses search completed'));
    } catch (error) {
      next(error);
    }
  }

  static async getPopularCourses(req, res, next) {
    try {
      const userId = req.user ? req.user.id : req.query.studentId;
      const courses = await CourseService.getPopularCourses(userId);
      res.json(ApiResponse.success(courses, 'Popular courses fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getRecommendedCourses(req, res, next) {
    try {
      const userId = req.user ? req.user.id : req.query.studentId;
      const courses = await CourseService.getRecommendedCourses(userId);
      res.json(ApiResponse.success(courses, 'Recommended courses fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : req.query.studentId;
      const course = await CourseService.getCourseById(id, userId);
      res.json(ApiResponse.success(course, 'Course details fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }

  static async getLessonsByCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const studentId = req.user ? req.user.id : req.query.studentId;
      const lessons = await LessonService.getLessonsByCourse(courseId, studentId);
      res.json(ApiResponse.success(lessons, 'Course lessons fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentsByCourse(req, res, next) {
    try {
      const { courseId } = req.params;
      const assignments = await AssignmentService.getAssignmentsByCourse(courseId);
      res.json(ApiResponse.success(assignments, 'Course assignments fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;
