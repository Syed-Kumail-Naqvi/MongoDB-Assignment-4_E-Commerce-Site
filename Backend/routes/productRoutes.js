const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/multer");

// Create product with image upload
router.post("/add", upload.single("image"), createProduct);

// Read all products
router.get("/", getAllProducts);

// Read single product
router.get("/:id", getSingleProduct);

// Update product with image upload
router.put("/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
