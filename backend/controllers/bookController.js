const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
    // We only select the necessary fields. wishlistCount is included for display.
    const books = await Book.find({}).select('-filePath');
    res.status(200).json(books);
});

// @desc    Get single book details
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @desc    Add a new book
// @route   POST /api/books
// @access  Private/Admin
const addBook = asyncHandler(async (req, res) => {
    const { title, author, description } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400);
        throw new Error('No book file was uploaded');
    }

    const bookFile = req.files.bookFile; // 'bookFile' is the expected field name from the frontend form
    const uploadPath = path.join(__dirname, '../uploads/book_files', bookFile.name);

    // Use mv() to place the file on the server
    await bookFile.mv(uploadPath, async (err) => {
        if (err) {
            console.error(err);
            res.status(500);
            throw new Error('File upload failed');
        }

        const book = await Book.create({
            title,
            author,
            description,
            // The path stored in the DB is relative to the backend static route (/uploads)
            filePath: `/book_files/${bookFile.name}`,
        });

        res.status(201).json({
            message: 'Book added successfully',
            book,
        });
    });
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        // 1. Delete the file from the server
        const fullFilePath = path.join(__dirname, '../uploads', book.filePath);
        if (fs.existsSync(fullFilePath)) {
            fs.unlinkSync(fullFilePath);
        }

        // 2. Remove the book from MongoDB
        await Book.deleteOne({ _id: book._id });
        
        // NOTE: In a complete solution, you would also need to update all 'User' documents
        // and remove this book's ID from their 'wishlist' array, and delete all associated 'Review' documents.

        res.status(200).json({ id: req.params.id, message: 'Book and associated file deleted successfully' });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

module.exports = {
    getBooks,
    getBookById,
    addBook,
    deleteBook,
};