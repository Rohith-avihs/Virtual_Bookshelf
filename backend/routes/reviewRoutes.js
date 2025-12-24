const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams needed if used as a sub-route
const { getReviewsForBook, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public: Get reviews for a book
router.get('/:bookId', getReviewsForBook);

// Private: Add a review to a book
router.post('/:bookId', protect, addReview);

module.exports = router;