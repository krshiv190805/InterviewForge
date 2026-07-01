const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  company: {
    type: String, 
    required: true
  },
  role: {
    type: String, 
    required: [true, 'Please add a target role']
  },
  term: {
    type: String, 
    required: [true, 'Please specify the term/year']
  },
  feedbackType: {
    type: String,
    enum: ['OA', 'Interview', 'General'],
    default: 'OA'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Please specify difficulty level']
  },
  topics: {
    type: [String],
    default: []
  },
  content: {
    type: String,
    required: [true, 'Please add details about your experience']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
