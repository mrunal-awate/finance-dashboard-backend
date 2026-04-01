const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

// All dashboard routes require login
router.use(protect);

// VIEWER cannot access dashboard
router.get('/summary', restrictTo('ADMIN', 'ANALYST'), getSummary);
router.get('/category-totals', restrictTo('ADMIN', 'ANALYST'), getCategoryWiseTotals);
router.get('/monthly-trends', restrictTo('ADMIN', 'ANALYST'), getMonthlyTrends);
router.get('/weekly-trends', restrictTo('ADMIN', 'ANALYST'), getWeeklyTrends);
router.get('/recent-activity', restrictTo('ADMIN', 'ANALYST'), getRecentActivity);

module.exports = router;