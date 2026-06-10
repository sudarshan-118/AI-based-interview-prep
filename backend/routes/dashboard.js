const express = require('express');
const router = express.Router();
const { requireAuth } = require('@clerk/express');
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', requireAuth(), dashboardController.getStats);
router.post('/session', requireAuth(), dashboardController.saveSession);
router.get('/sessions', requireAuth(), dashboardController.getSessions);

module.exports = router;
