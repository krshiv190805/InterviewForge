const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a note title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add note content']
  },
  tags: {
    type: [String],
    default: []
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', NoteSchema);
