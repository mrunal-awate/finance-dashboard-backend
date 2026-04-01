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

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Summary and analytics — Admin and Analyst only
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get overall financial summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns total income, expense and net balance
 */

/**
 * @swagger
 * /api/dashboard/category-totals:
 *   get:
 *     summary: Get category wise totals
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns totals grouped by category and type
 */

/**
 * @swagger
 * /api/dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly income and expense trends (last 12 months)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns monthly breakdown of income and expenses
 */

/**
 * @swagger
 * /api/dashboard/weekly-trends:
 *   get:
 *     summary: Get weekly income and expense trends (last 4 weeks)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns weekly breakdown of income and expenses
 */

/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Get last 10 financial records as recent activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns 10 most recent financial records
 */

router.use(protect);
router.get('/summary', restrictTo('ADMIN', 'ANALYST'), getSummary);
router.get('/category-totals', restrictTo('ADMIN', 'ANALYST'), getCategoryWiseTotals);
router.get('/monthly-trends', restrictTo('ADMIN', 'ANALYST'), getMonthlyTrends);
router.get('/weekly-trends', restrictTo('ADMIN', 'ANALYST'), getWeeklyTrends);
router.get('/recent-activity', restrictTo('ADMIN', 'ANALYST'), getRecentActivity);

module.exports = router;
