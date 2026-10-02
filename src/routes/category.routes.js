const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', CategoryController.getCategories);
router.get('/:id/courses', optionalAuth, CategoryController.getCoursesByCategory);

module.exports = router;
