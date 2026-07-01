const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String, // e.g., "4 Weeks"
    required: true
  },
  motive: {
    type: String,
    enum: ['internship', 'placement'],
    default: 'placement'
  },
  weeksLeft: {
    type: Number,
    default: 4
  },
  targetCompanies: {
    type: [String],
    default: []
  },
  topics: {
    type: [String],
    default: []
  },
  schedule: [
    {
      week: {
        type: Number,
        required: true
      },
      focus: {
        type: String,
        required: true
      },
      tasks: {
        type: [String],
        default: []
      },
      completedTasks: {
        type: [String],
        default: []
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
