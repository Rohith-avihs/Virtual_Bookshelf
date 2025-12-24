const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema(
    {
        teamMember1: {
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        teamMember2: {
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        teamMember3: {
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Contact', ContactSchema);