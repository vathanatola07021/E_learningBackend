const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progress.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, ProgressController.getCertificates);
router.get('/:id', optionalAuth, ProgressController.getCertificateById);

module.exports = router;
