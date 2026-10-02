const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const categoryRoutes = require('./category.routes');
const enrollmentRoutes = require('./enrollment.routes');
const lessonRoutes = require('./lesson.routes');
const quizRoutes = require('./quiz.routes');
const assignmentRoutes = require('./assignment.routes');
const progressRoutes = require('./progress.routes');
const certificateRoutes = require('./certificate.routes');
const profileRoutes = require('./profile.routes');
const notificationRoutes = require('./notification.routes');
const favoriteRoutes = require('./favorite.routes');

const db = require('../config/database');
const ApiResponse = require('../utils/apiResponse');

// Health Check API
router.get('/health', (req, res) => {
  res.json(
    ApiResponse.success(
      {
        status: 'UP',
        service: 'EduLearn Backend API',
        version: '1.0.0',
        databaseConnected: db.getIsDbConnected(),
        timestamp: new Date().toISOString(),
      },
      'EduLearn API is healthy and operational'
    )
  );
});

// Mount modular sub-routers under /api/v1
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/categories', categoryRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/quizzes', quizRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/progress', progressRoutes);
router.use('/certificates', certificateRoutes);
router.use('/profile', profileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/favorites', favoriteRoutes);

module.exports = router;
