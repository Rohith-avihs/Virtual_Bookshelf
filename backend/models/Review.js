const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'A review cannot be empty'],
        },
        // We can optionally add a rating here if you want to expand later
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Review', ReviewSchema);