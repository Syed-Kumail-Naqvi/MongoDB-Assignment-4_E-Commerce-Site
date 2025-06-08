const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // Store the Cloudinary image URL
  cloudinary_id: String, // For deleting/updating
});

// This is the crucial part to prevent the OverwriteModelError.
// It checks if the 'Product' model has already been compiled by Mongoose.
// If it exists, it uses the existing model; otherwise, it compiles and creates it.
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
