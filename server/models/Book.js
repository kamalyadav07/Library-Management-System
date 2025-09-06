const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  // Adds createdAt and updatedAt timestamps
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;