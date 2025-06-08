const multer = require('multer');
const path = require('path');

// Use memory storage to get the file as a buffer.
// This is crucial for direct processing (e.g., resizing, cropping)
// before sending the image data to a cloud service like Cloudinary.
const storage = multer.memoryStorage();

const profileUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size for profile images (adjust as needed)
  fileFilter: (req, file, cb) => {
    // Define allowed image file types and their extensions
    const filetypes = /jpeg|jpg|png|gif|webp/; // Including WEBP for modern formats
    const mimetype = filetypes.test(file.mimetype); // Check the MIME type of the file
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check the file's extension

    if (mimetype && extname) {
      // If both mimetype and extension are valid, accept the file
      return cb(null, true);
    }
    // If not valid, reject the file with an error message
    cb(new Error('Error: Profile image must be a JPEG, JPG, PNG, GIF, or WEBP file (max 5MB)!'));
  }
});

// This `profileUpload` middleware will be used with `.single('profileImage')`
// in your routes to indicate that it expects a single file under the 'profileImage' field name.
module.exports = profileUpload;