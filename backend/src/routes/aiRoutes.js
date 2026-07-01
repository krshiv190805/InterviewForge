const express = require('express');
const {
  generateHint,
  generateExplanation,
  generateMockInterview,
  evaluateInterview,
  generateStudyPlan,
  getStudyPlans,
  updateStudyPlanProgress
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/hint', generateHint);
router.post('/explanation', generateExplanation);
router.post('/mock-interview', generateMockInterview);
router.post('/evaluate-interview', evaluateInterview);
router.post('/study-plan', generateStudyPlan);
router.get('/study-plans', getStudyPlans);
router.put('/study-plan/:id/week/:weekNum', updateStudyPlanProgress);

module.exports = router;
