const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  nextRevisionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  interval: {
    type: Number,
    default: 1 
  },
  easeFactor: {
    type: Number,
    default: 2.5 
  },
  repetitions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

RevisionSchema.index({ user: 1, nextRevisionDate: 1 });

module.exports = mongoose.model('Revision', RevisionSchema);
