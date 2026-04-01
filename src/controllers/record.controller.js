const recordService = require('../services/record.service');
const { createRecordSchema, updateRecordSchema } = require('../validators/record.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/records
const createRecord = asyncHandler(async (req, res) => {
  const parsed = createRecordSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'Validation failed', parsed.error.flatten().fieldErrors);
  }
  const record = await recordService.createRecord(req.user.id, parsed.data);
  return successResponse(res, 201, 'Record created successfully', record);
});

// GET /api/records
const getAllRecords = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, page, limit } = req.query;

  // Viewers and analysts only see their own records
  const filters = {
    type,
    category,
    startDate,
    endDate,
    // Admin sees all records, others see only their own
    userId: req.user.role === 'ADMIN' ? undefined : req.user.id,
  };

  const result = await recordService.getAllRecords(
    filters,
    parseInt(page) || 1,
    parseInt(limit) || 10
  );

  return successResponse(res, 200, 'Records fetched successfully', result);
});

// GET /api/records/:id
const getRecordById = asyncHandler(async (req, res) => {
  const record = await recordService.getRecordById(req.params.id, req.user);
  return successResponse(res, 200, 'Record fetched successfully', record);
});

// PATCH /api/records/:id
const updateRecord = asyncHandler(async (req, res) => {
  const parsed = updateRecordSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'Validation failed', parsed.error.flatten().fieldErrors);
  }
  const record = await recordService.updateRecord(req.params.id, req.user, parsed.data);
  return successResponse(res, 200, 'Record updated successfully', record);
});

// DELETE /api/records/:id
const deleteRecord = asyncHandler(async (req, res) => {
  const result = await recordService.deleteRecord(req.params.id, req.user);
  return successResponse(res, 200, result.message);
});

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};