const express = require('express');
const { getCompanySheet } = require('../controllers/sheetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:company', protect, getCompanySheet);

module.exports = router;
