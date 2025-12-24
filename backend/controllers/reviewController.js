const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get all reviews for a specific book
// @route   GET /api/reviews/:bookId
// @access  Public
const getReviewsForBook = asyncHandler(async (req, res) => {
    // Populate the 'user' field to show who gave the review (name and email)
    const reviews = await Review.find({ book: req.params.bookId })
        .populate('user', 'name email')
        .sort({ createdAt: -1 }); // Show newest reviews first

    if (reviews) {
        res.status(200).json(reviews);
    } else {
        res.status(404);
        throw new Error('No reviews found for this book');
    }
});

// @desc    Add a review to a book
// @route   POST /api/reviews/:bookId
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    const { text, rating } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user.id; // Comes from the 'protect' middleware

    if (!text) {
        res.status(400);
        throw new Error('Review text is required');
    }

    // 1. Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    // 2. Check if the user has already reviewed this book (optional but good practice)
    const alreadyReviewed = await Review.findOne({ book: bookId, user: userId });
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this book');
    }

    // 3. Create the review
    const review = await Review.create({
        book: bookId,
        user: userId,
        text,
        rating,
    });

    // 4. Populate the user data for the response
    await review.populate('user', 'name email');

    res.status(201).json({
        message: 'Review added successfully',
        review,
    });
});

module.exports = {
    getReviewsForBook,
    addReview,
};