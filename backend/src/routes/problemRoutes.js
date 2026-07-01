const express = require('express');
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProblems)
  .post(createProblem);

router.route('/:id')
  .get(getProblem)
  .put(updateProblem)
  .delete(deleteProblem);

module.exports = router;
