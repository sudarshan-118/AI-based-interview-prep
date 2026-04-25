const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/generate-questions', interviewController.generateQuestions);
router.post('/evaluate-answer', interviewController.evaluateAnswer);
router.post('/mock-interview', interviewController.startMockInterview);
router.post('/feedback', interviewController.getFeedback);
router.get('/job-roles', interviewController.getJobRoles);

module.exports = router;
