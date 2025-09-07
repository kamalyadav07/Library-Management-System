const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/books
// @desc    Add a new book (Admin only)
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
// @desc    Fetch all available books with pagination
// server/routes/bookRoutes.js

router.get('/', async (req, res) => {
  const limit = 10;
  const page = parseInt(req.query.page) || 1;
  
  // Build query object
  const query = { isAvailable: true };
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { author: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }

  // Build sort object
  const sort = {};
  if (req.query.sort) {
    const [field, order] = req.query.sort.split('_');
    sort[field] = order === 'asc' ? 1 : -1;
  } else {
    sort.title = 1; // Default sort
  }

  try {
    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
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

// @route   GET /api/books/:id
// @desc    Get a single book by its ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/books/:id/borrow
// @desc    Borrow a book (Logged-in users)
router.put('/:id/borrow', auth, async (req, res) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false, dueDate: dueDate, borrowedBy: req.user.id },
      { new: true }
    );
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/books/:id/return
// @route   PUT /api/books/:id/return
// @desc    Return a book (Logged-in users)
router.put('/:id/return', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    // SECURITY CHECK: Ensure the user returning the book is the one who borrowed it
    if (!book.borrowedBy || book.borrowedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to return this book' });
    }

    // If the check passes, update the book
    book.isAvailable = true;
    book.dueDate = null;
    book.borrowedBy = null;

    await book.save();
    res.json(book);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/books/:id/reviews
// @desc    Add a review to a book
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      const alreadyReviewed = book.reviews.find(
        r => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ msg: 'You have already reviewed this book' });
      }

      const review = {
        user: req.user.id,
        username: req.user.username, // We'll need to add this to the token
        rating: Number(rating),
        comment,
      };

      book.reviews.push(review);
      await book.save();
      res.status(201).json({ msg: 'Review added' });
    } else {
      res.status(404).json({ msg: 'Book not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;