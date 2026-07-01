const express = require('express');
const { getCompanyFeedbacks, createFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:company', protect, getCompanyFeedbacks);
router.post('/', protect, createFeedback);

module.exports = router;
