const express = require('express');
const router = express.Router();
const { getBooks, getBookById, addBook, deleteBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public route to get all books and a single book
router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin routes for adding/deleting books
router.post('/', protect, admin, addBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;