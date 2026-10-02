const FavoriteService = require('../services/favorite.service');
const ApiResponse = require('../utils/apiResponse');

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const userId = req.user ? req.user.id : (req.query.userId || req.query.studentId || 'usr_student_01');
      const courses = await FavoriteService.getFavorites(userId);
      res.json(ApiResponse.success(courses, 'Favorite courses fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async saveFavorite(req, res, next) {
    try {
      const { courseId } = req.params;
      const userId = req.user ? req.user.id : (req.body.userId || req.query.userId || 'usr_student_01');
      await FavoriteService.saveFavorite(userId, courseId);
      res.json(ApiResponse.success(null, 'Course added to favorites'));
    } catch (error) {
      next(error);
    }
  }

  static async removeFavorite(req, res, next) {
    try {
      const { courseId } = req.params;
      const userId = req.user ? req.user.id : (req.body.userId || req.query.userId || 'usr_student_01');
      await FavoriteService.removeFavorite(userId, courseId);
      res.json(ApiResponse.success(null, 'Course removed from favorites'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;
