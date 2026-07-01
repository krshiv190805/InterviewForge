const Feedback = require('../models/Feedback');

// @desc    Get feedbacks for a specific company
// @route   GET /api/feedback/:company
// @access  Private
const getCompanyFeedbacks = async (req, res, next) => {
  try {
    const company = req.params.company.toLowerCase();
    
    const feedbacks = await Feedback.find({ company })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new feedback / experience post
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res, next) => {
  try {
    const { company, role, term, feedbackType, difficulty, topics, content, isAnonymous } = req.body;

    if (!company || !role || !term || !difficulty || !content) {
      res.statusCode = 400;
      throw new Error('Please include company, role, term, difficulty, and experience content');
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      isAnonymous: !!isAnonymous,
      company: company.toLowerCase(),
      role,
      term,
      feedbackType: feedbackType || 'OA',
      difficulty,
      topics: Array.isArray(topics) ? topics : [],
      content
    });

    // Populate user info for immediate frontend display ease
    const populatedFeedback = await Feedback.findById(feedback._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      feedback: populatedFeedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanyFeedbacks,
  createFeedback
};
