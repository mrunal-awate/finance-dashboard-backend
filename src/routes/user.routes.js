const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

// All routes require login
router.use(protect);

// ADMIN only routes
router.get('/', restrictTo('ADMIN'), getAllUsers);
router.patch('/:id', restrictTo('ADMIN'), updateUser);
router.delete('/:id', restrictTo('ADMIN'), deleteUser);
router.patch('/:id/toggle-status', restrictTo('ADMIN'), toggleUserStatus);

// ADMIN and ANALYST can view a single user
router.get('/:id', restrictTo('ADMIN', 'ANALYST'), getUserById);

module.exports = router;