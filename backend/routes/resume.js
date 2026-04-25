const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/analyze', resumeController.analyzeResume);
router.post('/improve', resumeController.improveResume);
router.post('/tailor', resumeController.tailorResume);

module.exports = router;
