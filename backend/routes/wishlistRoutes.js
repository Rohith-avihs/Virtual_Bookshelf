const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes are protected
router.get('/', protect, getWishlist);
router.put('/add/:bookId', protect, addToWishlist);
router.put('/remove/:bookId', protect, removeFromWishlist);

module.exports = router;