const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: String,
  filename: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', noteSchema);