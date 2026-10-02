const CategoryService = require('../services/category.service');
const CourseService = require('../services/course.service');
const ApiResponse = require('../utils/apiResponse');

class CategoryController {
  static async getCategories(req, res, next) {
    try {
      const categories = await CategoryService.getCategories();
      res.json(ApiResponse.success(categories, 'Categories fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesByCategory(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : req.query.studentId;
      const courses = await CourseService.getCoursesByCategory(id, userId);
      res.json(ApiResponse.success(courses, 'Courses for category fetched successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
