const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// Default initial contact data (Requirement #5 default info)
const defaultContactInfo = {
    teamMember1: { name: 'B.Rohith Reddy', email: 'rohithreddy.23cse@cambridge.edu.in' },
    teamMember2: { name: 'Harish E', email: 'harishe.23cse@cambridge.edu.in' },
    teamMember3: { name: 'L Chandhan Prasad Reddy', email: 'Chandanprasad.23cse@cambridge.edu.in' },
};

// Function to ensure the contact document exists
const initializeContactInfo = async () => {
    const count = await Contact.countDocuments();
    if (count === 0) {
        await Contact.create(defaultContactInfo);
        console.log('Default contact info initialized.');
    }
};

// @desc    Get contact information
// @route   GET /api/contact
// @access  Public
const getContactInfo = asyncHandler(async (req, res) => {
    // Find the single contact document (there should only be one)
    const contact = await Contact.findOne({});

    if (contact) {
        res.status(200).json(contact);
    } else {
        // If not found (shouldn't happen after initialization), create default and return
        const newContact = await Contact.create(defaultContactInfo);
        res.status(200).json(newContact);
    }
});

// @desc    Update contact information
// @route   PUT /api/contact
// @access  Private/Admin
const updateContactInfo = asyncHandler(async (req, res) => {
    const updateData = req.body;

    // Use findOneAndUpdate to find the single document and update it
    const updatedContact = await Contact.findOneAndUpdate(
        {}, // Filter: find the first (and only) document
        updateData,
        { new: true, runValidators: true } // Return the updated doc, run schema validation
    );

    if (updatedContact) {
        res.status(200).json({
            message: 'Contact information updated successfully',
            contact: updatedContact,
        });
    } else {
        res.status(404);
        throw new Error('Contact document not found');
    }
});

module.exports = {
    initializeContactInfo,
    getContactInfo,
    updateContactInfo,
};