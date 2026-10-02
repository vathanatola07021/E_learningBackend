const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollment.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/enroll', optionalAuth, EnrollmentController.enroll);
router.get('/my', optionalAuth, EnrollmentController.getMyEnrollments);
router.get('/check', optionalAuth, EnrollmentController.checkEnrollment);
router.get('/detail', optionalAuth, EnrollmentController.getEnrollmentDetail);
router.get('/', optionalAuth, EnrollmentController.getAll);

module.exports = router;
