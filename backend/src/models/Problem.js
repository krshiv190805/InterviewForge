const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a problem title'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: [true, 'Please select difficulty']
  },
  topic: {
    type: String,
    required: [true, 'Please specify the topic'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Todo', 'Attempted', 'Solved'],
    default: 'Todo'
  },
  companies: {
    type: [String],
    default: []
  },
  link: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    default: ''
  },
  codeSolution: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', ProblemSchema);
