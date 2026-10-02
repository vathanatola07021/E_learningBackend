const EnrollmentService = require('../services/enrollment.service');
const ApiResponse = require('../utils/apiResponse');

class EnrollmentController {
  static async enroll(req, res, next) {
    try {
      const studentId = req.body.studentId || (req.user ? req.user.id : null);
      const { courseId } = req.body;
      const enrollment = await EnrollmentService.enrollInCourse(courseId, studentId);
      res.status(201).json(ApiResponse.success(enrollment, 'Enrolled in course successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }

  static async getMyEnrollments(req, res, next) {
    try {
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const courses = await EnrollmentService.getEnrolledCourses(studentId);
      res.json(ApiResponse.success(courses, 'Enrolled courses fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async checkEnrollment(req, res, next) {
    try {
      const { courseId } = req.query;
      const studentId = req.query.studentId || (req.user ? req.user.id : null);
      const isEnrolled = await EnrollmentService.isEnrolled(courseId, studentId);
      res.json(ApiResponse.success(isEnrolled, 'Enrollment check completed'));
    } catch (error) {
      next(error);
    }
  }

  static async getEnrollmentDetail(req, res, next) {
    try {
      const { courseId } = req.query;
      const studentId = req.query.studentId || (req.user ? req.user.id : null);
      const enrollment = await EnrollmentService.getEnrollment(courseId, studentId);
      res.json(ApiResponse.success(enrollment, 'Enrollment details fetched'));
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const enrollments = await EnrollmentService.getAllEnrollments();
      res.json(ApiResponse.success(enrollments, 'All enrollments fetched'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EnrollmentController;
