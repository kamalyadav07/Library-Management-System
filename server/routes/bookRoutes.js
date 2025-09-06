const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/books
// @desc    Add a new book
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const { title, author, isbn } = req.body;
    const newBook = new Book({ title, author, isbn });
    const book = await newBook.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/books
// @desc    Fetch all available books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: true });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/books/borrowed
// @desc    Fetch all borrowed books
router.get('/borrowed', async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: false });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/books/:id/borrow
// @desc    Borrow a book
router.put('/:id/borrow', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/books/:id/return
// @desc    Return a book
router.put('/:id/return', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isAvailable: true },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;