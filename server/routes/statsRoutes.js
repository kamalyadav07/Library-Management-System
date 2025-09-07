const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Book = require('../models/Book');
const User = require('../models/User');

// @route   GET /api/stats
// @desc    Get library statistics (Admin only)
router.get('/', [auth, isAdmin], async (req, res) => {
  try {
    // Run database queries in parallel for efficiency
    const [totalBooks, borrowedBooks, totalUsers, overdueBooks] = await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ isAvailable: false }),
      User.countDocuments(),
      Book.countDocuments({
        isAvailable: false,
        dueDate: { $lt: new Date() } // $lt means "less than"
      })
    ]);

    res.json({
      totalBooks,
      borrowedBooks,
      availableBooks: totalBooks - borrowedBooks,
      totalUsers,
      overdueBooks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;