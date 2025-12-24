const express = require('express');
const router = express.Router();
const { getContactInfo, updateContactInfo } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public: Get contact information
router.get('/', getContactInfo);

// Private/Admin: Update contact information
router.put('/', protect, admin, updateContactInfo);

module.exports = router;