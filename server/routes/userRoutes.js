// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Book = require('../models/Book');

// @route   GET /api/users/borrowed
// @desc    Get all books borrowed by the logged-in user
router.get('/borrowed', auth, async (req, res) => {
  try {
    const userBorrowedBooks = await Book.find({ borrowedBy: req.user.id });
    res.json(userBorrowedBooks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;