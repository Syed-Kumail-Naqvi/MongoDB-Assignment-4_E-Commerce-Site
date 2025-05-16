const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String, // Store the Cloudinary image URL
  cloudinary_id: String, // For deleting/updating
});

module.exports = mongoose.model('Product', productSchema);