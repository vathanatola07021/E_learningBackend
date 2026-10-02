const NotificationService = require('../services/notification.service');
const ApiResponse = require('../utils/apiResponse');

class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const userId = req.query.userId || (req.user ? req.user.id : 'usr_student_01');
      const notifications = await NotificationService.getNotifications(userId);
      res.json(ApiResponse.success(notifications, 'Notifications fetched successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(id);
      res.json(ApiResponse.success(null, 'Notification marked as read'));
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      const userId = req.query.userId || (req.user ? req.user.id : 'usr_student_01');
      await NotificationService.markAllAsRead(userId);
      res.json(ApiResponse.success(null, 'All notifications marked as read'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
