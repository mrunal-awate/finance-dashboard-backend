const prisma = require('../config/db');

// Create a new financial record
const createRecord = async (userId, data) => {
  const record = await prisma.financialRecord.create({
    data: {
      ...data,
      date: new Date(data.date),
      userId,
    },
  });
  return record;
};

// Get all records with filters + pagination
const getAllRecords = async (filters, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // Build dynamic filter object
  const where = { isDeleted: false };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };

  // Date range filter
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  // Analyst/Viewer can only see their own records
  if (filters.userId) where.userId = filters.userId;

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      skip,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single record by ID
const getRecordById = async (id, user) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!record) {
    const error = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }

  // Viewer/Analyst can only view their own records
  if (user.role !== 'ADMIN' && record.userId !== user.id) {
    const error = new Error('Access denied. You can only view your own records.');
    error.statusCode = 403;
    throw error;
  }

  return record;
};

// Update a record
const updateRecord = async (id, user, data) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    const error = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }

  // Only admin or owner can update
  if (user.role !== 'ADMIN' && record.userId !== user.id) {
    const error = new Error('Access denied. You can only update your own records.');
    error.statusCode = 403;
    throw error;
  }

  const updated = await prisma.financialRecord.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  });

  return updated;
};

// Soft delete a record
const deleteRecord = async (id, user) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    const error = new Error('Record not found');
    error.statusCode = 404;
    throw error;
  }

  // Only admin or owner can delete
  if (user.role !== 'ADMIN' && record.userId !== user.id) {
    const error = new Error('Access denied. You can only delete your own records.');
    error.statusCode = 403;
    throw error;
  }

  await prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: 'Record deleted successfully' };
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};