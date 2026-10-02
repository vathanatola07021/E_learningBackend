const ProfileService = require('../services/profile.service');
const ApiResponse = require('../utils/apiResponse');

class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const studentId = req.query.studentId || (req.user ? req.user.id : 'usr_student_01');
      const profile = await ProfileService.getStudentProfile(studentId);
      res.json(ApiResponse.success(profile, 'Student profile fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const studentId = req.body.studentId || (req.user ? req.user.id : 'usr_student_01');
      const { fullName, phoneNumber, educationLevel, dateOfBirth, profilePhoto } = req.body;
      const updated = await ProfileService.updateProfile({
        studentId,
        fullName,
        phoneNumber,
        educationLevel,
        dateOfBirth,
        profilePhoto,
      });
      res.json(ApiResponse.success(updated, 'Profile updated successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }
}

module.exports = ProfileController;
