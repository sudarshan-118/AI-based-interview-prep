const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.post('/session', dashboardController.saveSession);
router.get('/sessions', dashboardController.getSessions);

module.exports = router;
