const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    // Populate the wishlist array with actual book data
    const user = await User.findById(req.user.id).populate('wishlist');

    if (user) {
        res.status(200).json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add book to user wishlist
// @route   PUT /api/wishlist/add/:bookId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    // Check if the book is already in the wishlist
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(bookId)) {
        res.status(400);
        throw new Error('Book already in wishlist');
    }

    // 1. Add book ID to user's wishlist array
    user.wishlist.push(bookId);
    await user.save();

    // 2. Increment the book's wishlistCount (Requirement #6)
    book.wishlistCount += 1;
    await book.save();

    res.status(200).json({ message: 'Book added to wishlist', bookId });
});

// @desc    Remove book from user wishlist
// @route   PUT /api/wishlist/remove/:bookId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const bookId = req.params.bookId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }
    
    // 1. Remove book ID from user's wishlist array
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(bookId)) {
        res.status(400);
        throw new Error('Book not in wishlist');
    }

    user.wishlist = user.wishlist.filter(item => item.toString() !== bookId);
    await user.save();

    // 2. Decrement the book's wishlistCount (Requirement #6)
    // Ensure the count doesn't go below zero
    if (book.wishlistCount > 0) {
        book.wishlistCount -= 1;
        await book.save();
    }

    res.status(200).json({ message: 'Book removed from wishlist', bookId });
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};