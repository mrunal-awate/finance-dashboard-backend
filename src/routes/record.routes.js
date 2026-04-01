const express = require('express');
const router = express.Router();
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('../controllers/record.controller');
const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');

// All routes require login
router.use(protect);

// VIEWER can only GET — ANALYST and ADMIN can do everything
router.get('/', restrictTo('ADMIN', 'ANALYST', 'VIEWER'), getAllRecords);
router.get('/:id', restrictTo('ADMIN', 'ANALYST', 'VIEWER'), getRecordById);
router.post('/', restrictTo('ADMIN', 'ANALYST'), createRecord);
router.patch('/:id', restrictTo('ADMIN', 'ANALYST'), updateRecord);
router.delete('/:id', restrictTo('ADMIN', 'ANALYST'), deleteRecord);

module.exports = router;