const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/dashboard/summary
const getSummary = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSummary(req.user);
  return successResponse(res, 200, 'Summary fetched successfully', data);
});

// GET /api/dashboard/category-totals
const getCategoryWiseTotals = asyncHandler(async (req, res) => {
  const data = await dashboardService.getCategoryWiseTotals(req.user);
  return successResponse(res, 200, 'Category totals fetched successfully', data);
});

// GET /api/dashboard/monthly-trends
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMonthlyTrends(req.user);
  return successResponse(res, 200, 'Monthly trends fetched successfully', data);
});

// GET /api/dashboard/weekly-trends
const getWeeklyTrends = asyncHandler(async (req, res) => {
  const data = await dashboardService.getWeeklyTrends(req.user);
  return successResponse(res, 200, 'Weekly trends fetched successfully', data);
});

// GET /api/dashboard/recent-activity
const getRecentActivity = asyncHandler(async (req, res) => {
  const data = await dashboardService.getRecentActivity(req.user);
  return successResponse(res, 200, 'Recent activity fetched successfully', data);
});

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
};