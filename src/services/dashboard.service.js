const prisma = require('../config/db');

// Helper: base where clause depending on role
const getBaseWhere = (user) => {
  const where = { isDeleted: false };
  // Non-admins only see their own records
  if (user.role !== 'ADMIN') where.userId = user.id;
  return where;
};

// 1. Overall Summary (total income, expense, net balance)
const getSummary = async (user) => {
  const where = getBaseWhere(user);

  const [incomeData, expenseData] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'INCOME' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: 'EXPENSE' },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = incomeData._sum.amount || 0;
  const totalExpense = expenseData._sum.amount || 0;

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalIncomeRecords: incomeData._count,
    totalExpenseRecords: expenseData._count,
  };
};

// 2. Category wise totals
const getCategoryWiseTotals = async (user) => {
  const where = getBaseWhere(user);

  const records = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where,
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: 'desc' } },
  });

  // Format into clean structure
  const formatted = records.map((r) => ({
    category: r.category,
    type: r.type,
    total: r._sum.amount || 0,
    count: r._count,
  }));

  return formatted;
};

// 3. Monthly trends (last 12 months)
const getMonthlyTrends = async (user) => {
  const where = getBaseWhere(user);

  // Get records from last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const records = await prisma.financialRecord.findMany({
    where: {
      ...where,
      date: { gte: twelveMonthsAgo },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: 'asc' },
  });

  // Group by year-month manually
  const monthlyMap = {};

  records.forEach((record) => {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, income: 0, expense: 0, net: 0 };
    }

    if (record.type === 'INCOME') {
      monthlyMap[key].income += record.amount;
    } else {
      monthlyMap[key].expense += record.amount;
    }

    monthlyMap[key].net = monthlyMap[key].income - monthlyMap[key].expense;
  });

  return Object.values(monthlyMap);
};

// 4. Weekly trends (last 4 weeks)
const getWeeklyTrends = async (user) => {
  const where = getBaseWhere(user);

  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const records = await prisma.financialRecord.findMany({
    where: {
      ...where,
      date: { gte: fourWeeksAgo },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: 'asc' },
  });

  // Group by week number
  const weeklyMap = {};

  records.forEach((record) => {
    const date = new Date(record.date);
    // Get week start (Monday)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    const key = weekStart.toISOString().split('T')[0];

    if (!weeklyMap[key]) {
      weeklyMap[key] = { weekStart: key, income: 0, expense: 0, net: 0 };
    }

    if (record.type === 'INCOME') {
      weeklyMap[key].income += record.amount;
    } else {
      weeklyMap[key].expense += record.amount;
    }

    weeklyMap[key].net = weeklyMap[key].income - weeklyMap[key].expense;
  });

  return Object.values(weeklyMap);
};

// 5. Recent activity (last 10 records)
const getRecentActivity = async (user) => {
  const where = getBaseWhere(user);

  const records = await prisma.financialRecord.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return records;
};

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
};