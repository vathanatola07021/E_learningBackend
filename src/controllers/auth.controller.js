const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);
      res.json(ApiResponse.success(user, 'Login successful'));
    } catch (error) {
      res.status(401).json(ApiResponse.error(error.message, null, 401));
    }
  }

  static async register(req, res, next) {
    try {
      const { fullName, email, password, phoneNumber } = req.body;
      const user = await AuthService.register({ fullName, email, password, phoneNumber });
      res.status(201).json(ApiResponse.success(user, 'Account registered successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }

  static async logout(req, res) {
    res.json(ApiResponse.success(null, 'Logged out successfully'));
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
      const tokens = await AuthService.refreshToken(refreshToken);
      res.json(ApiResponse.success(tokens, 'Token refreshed successfully'));
    } catch (error) {
      res.status(401).json(ApiResponse.error(error.message, null, 401));
    }
  }

  static async changePassword(req, res) {
    try {
      const userId = req.user ? req.user.id : req.body.userId;
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.json(ApiResponse.success(null, 'Password updated successfully'));
    } catch (error) {
      res.status(400).json(ApiResponse.error(error.message, null, 400));
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const userId = req.user ? req.user.id : 'usr_student_01';
      const user = await AuthService.getCurrentUser(userId);
      res.json(ApiResponse.success(user, 'User profile fetched successfully'));
    } catch (error) {
      res.status(404).json(ApiResponse.error(error.message, null, 404));
    }
  }
}

module.exports = AuthController;
