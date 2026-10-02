const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, NotificationController.getNotifications);
router.put('/read-all', optionalAuth, NotificationController.markAllAsRead);
router.put('/:id/read', optionalAuth, NotificationController.markAsRead);

module.exports = router;
