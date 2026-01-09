const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Link to your Cloudinary Account
// Make sure these match your .env file keys exactly
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'virtual_bookshelf_covers', // The folder name inside Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 750, crop: 'limit' }] // Auto-resize covers
  },
});

// 3. Create the upload function
const upload = multer({ storage: storage });

module.exports = upload;
