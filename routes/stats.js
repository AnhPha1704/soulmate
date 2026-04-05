const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Ensure user is authenticated

router.get('/total-exp', statsController.getTotalExp);
router.get('/mood-count', statsController.getMoodCount);
router.get('/leaderboard', statsController.getLeaderboard);
router.get('/mood-summary', statsController.getMoodSummaryByMonth);
router.get('/task-completion', statsController.getTaskCompletionRatio);
router.get('/logs-with-info', statsController.getLogsWithUserAndPet);
router.get('/avg-completion-time', statsController.getAvgTaskCompletionTime);
router.get('/late-tasks', statsController.getLateCompletedTasks);
router.get('/specific-tasks', statsController.getSpecificTasks);
router.get('/inactive-pets', statsController.getInactivePets);

module.exports = router;
