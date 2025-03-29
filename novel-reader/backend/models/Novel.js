const mongoose = require('mongoose');

const novelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  coverImage: String,
  description: String,
  chapters: [{
    title: String,
    content: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Novel', novelSchema);