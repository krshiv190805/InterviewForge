const express = require('express');
const {
  getRevisions,
  createOrUpdateRevision
} = require('../controllers/revisionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getRevisions)
  .post(createOrUpdateRevision);

module.exports = router;
