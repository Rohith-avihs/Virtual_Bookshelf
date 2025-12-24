const mongoose = require('mongoose');

const BookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a book title'],
        },
        author: {
            type: String,
            required: [true, 'Please add the author name'],
        },
        description: {
            type: String,
        },
        // Path to the stored book file (e.g., PDF)
        filePath: {
            type: String,
            required: true,
        },
        // Requirement #6: Count of users who added this to their wishlist
        wishlistCount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Book', BookSchema);