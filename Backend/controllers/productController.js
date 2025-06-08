const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      image: req.file.path, // Cloudinary URL
      cloudinary_id: req.file.filename, // public_id from Cloudinary
    });

    await product.save();
    console.log(product);


    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ Message: "Product Not Found!" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body; // Added category here

    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product Not Found!" }); // Consistent message key

    // If image updated
    if (req.file) {
      // delete old one from Cloudinary
      await cloudinary.uploader.destroy(product.cloudinary_id);

      product.image = req.file.path; // Cloudinary URL
      product.cloudinary_id = req.file.filename; // new Cloudinary public_id
    }

    // Prepare update object
    const updateFields = {
      name: name || product.name,
      price: price || product.price,
      description: description || product.description,
      category: category || product.category, // Now 'category' is available
    };

    // Update the product using findByIdAndUpdate
    product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ Message: "Product Not Found!" });

    await cloudinary.uploader.destroy(product.cloudinary_id);
    await product.remove();

    res.status(200).json({ success: true, Message: "Product Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, Message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};