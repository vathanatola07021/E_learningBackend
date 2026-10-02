const express = require('express');
const router = express.Router();
const AssignmentController = require('../controllers/assignment.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/:id/submit', optionalAuth, AssignmentController.submitAssignment);
router.get('/:id/submissions/my', optionalAuth, AssignmentController.getMySubmission);
router.get('/:id', optionalAuth, AssignmentController.getAssignmentById);

module.exports = router;
