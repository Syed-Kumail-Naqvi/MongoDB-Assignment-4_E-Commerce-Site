const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce_products",
    });

    // Create product
    const product = new Product({
      name,
      price,
      description,
      image: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await product.save();

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ success: true, product });
  } catch (error) {
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
    const { name, price, description } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ Message: "Product Not Found!" });

    // If new image uploaded, delete old one and upload new
    if (req.file) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ecommerce_products",
      });

      product.image = result.secure_url;
      product.cloudinary_id = result.public_id;

      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
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
