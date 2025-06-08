const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// *** THE FIX IS HERE ***
// Specify that you are expecting a SINGLE file upload with the field name 'image'
const upload = multer({ storage }).single('image'); // <-- Add .single('image')

module.exports = upload;