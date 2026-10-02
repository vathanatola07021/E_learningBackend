const AssignmentService = require('../services/assignment.service');
const ApiResponse = require('../utils/apiResponse');

class AssignmentController {
  static async getAssignmentById(req, res, next) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentService.getAssignmentById(id);
      res.json(ApiResponse.success(assignment, 'Assignment fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }

  static async submitAssignment(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.body.studentId || (req.user ? req.user.id : 'usr_student_01');
      const { textSubmission, submissionFile, comment } = req.body;
      const submission = await AssignmentService.submitAssignment({
        assignmentId: id,
        studentId,
        textSubmission,
        submissionFile,
        comment,
      });
      res.status(201).json(ApiResponse.success(submission, 'Assignment submitted successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }

  static async getMySubmission(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const submission = await AssignmentService.getMySubmission(id, studentId);
      res.json(ApiResponse.success(submission, 'Submission fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AssignmentController;
