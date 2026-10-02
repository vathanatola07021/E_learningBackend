const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favorite.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, FavoriteController.getFavorites);
router.post('/:courseId', optionalAuth, FavoriteController.saveFavorite);
router.delete('/:courseId', optionalAuth, FavoriteController.removeFavorite);

module.exports = router;
