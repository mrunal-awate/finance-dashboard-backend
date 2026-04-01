const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  // Validate input
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'Validation failed', parsed.error.flatten().fieldErrors);
  }

  const result = await authService.register(parsed.data);
  return successResponse(res, 201, 'User registered successfully', result);
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, 400, 'Validation failed', parsed.error.flatten().fieldErrors);
  }

  const result = await authService.login(parsed.data);
  return successResponse(res, 200, 'Login successful', result);
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return successResponse(res, 200, 'Profile fetched', user);
});

module.exports = { register, login, getMe };