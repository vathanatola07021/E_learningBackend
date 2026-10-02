const ProgressService = require('../services/progress.service');
const ApiResponse = require('../utils/apiResponse');

class ProgressController {
  static async getCourseProgress(req, res, next) {
    try {
      const { courseId } = req.params;
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const progress = await ProgressService.getCourseProgress(courseId, studentId);
      res.json(ApiResponse.success(progress, 'Course progress fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getLearningHistory(req, res, next) {
    try {
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const history = await ProgressService.getLearningHistory(studentId);
      res.json(ApiResponse.success(history, 'Learning history fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getCertificates(req, res, next) {
    try {
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const certificates = await ProgressService.getCertificates(studentId);
      res.json(ApiResponse.success(certificates, 'Certificates fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getCertificateById(req, res, next) {
    try {
      const { id } = req.params;
      const certificate = await ProgressService.getCertificateById(id);
      if (!certificate) {
        return res.status(404).json(ApiResponse.error('Certificate not found', null, 404));
      }
      res.json(ApiResponse.success(certificate, 'Certificate fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProgressController;
