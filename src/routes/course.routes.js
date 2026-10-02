const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, CourseController.getCourses);
router.get('/search', optionalAuth, CourseController.searchCourses);
router.get('/popular', optionalAuth, CourseController.getPopularCourses);
router.get('/recommended', optionalAuth, CourseController.getRecommendedCourses);
router.get('/:courseId/lessons', optionalAuth, CourseController.getLessonsByCourse);
router.get('/:courseId/assignments', optionalAuth, CourseController.getAssignmentsByCourse);
router.get('/:id', optionalAuth, CourseController.getCourseById);

module.exports = router;
