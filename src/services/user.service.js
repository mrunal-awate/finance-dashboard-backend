const prisma = require('../config/db');

// Get all users (with pagination)
const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { deletedAt: null } }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single user by ID
const getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Update user
const updateUser = async (id, data) => {
  // Check user exists
  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Check email uniqueness if email is being updated
  if (data.email && data.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailTaken) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return updated;
};

// Soft delete user
const deleteUser = async (id, requestingUserId) => {
  // Prevent admin from deleting themselves
  if (id === requestingUserId) {
    const error = new Error('You cannot delete your own account');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { message: 'User deleted successfully' };
};

// Activate or deactivate user
const toggleUserStatus = async (id, requestingUserId) => {
  if (id === requestingUserId) {
    const error = new Error('You cannot change your own status');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !existing.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updated;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};