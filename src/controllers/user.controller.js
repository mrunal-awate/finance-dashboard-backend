const userService = require('../services/user.service');
const { updateUserSchema } = require('../validators/user.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await userService.getAllUsers(page, limit);
  return successResponse(res, 200, 'Users fetched successfully', result);
});

// GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return successResponse(res, 200, 'User fetched successfully', user);
});

// PATCH /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'Validation failed', parsed.error.flatten().fieldErrors);
  }
  const user = await userService.updateUser(req.params.id, parsed.data);
  return successResponse(res, 200, 'User updated successfully', user);
});

// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.user.id);
  return successResponse(res, 200, result.message);
});

// PATCH /api/users/:id/toggle-status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.id, req.user.id);
  const msg = user.isActive ? 'User activated successfully' : 'User deactivated successfully';
  return successResponse(res, 200, msg, user);
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};