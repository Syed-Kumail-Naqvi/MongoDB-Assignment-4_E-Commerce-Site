const express = require("express");
const router = express.Router();

// Controllers
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { createOrder } = require("../controllers/orderController");
const { getAllUsersWithOrders } = require("../controllers/adminController");

// ---------------- MIDDLEWARE -------------------
const { protect, protectAdmin } = require("../middleware/middleware");
const upload = require("../middleware/multer");

// ---------------- AUTH ROUTES -------------------
router.post("/api/auth/register", registerUser);
router.post("/api/auth/login", loginUser);

// ---------------- PRODUCT ROUTES ----------------
router.post("/api/products", upload.single("image"), protectAdmin, createProduct);
router.get("/api/products", getAllProducts);
router.get("/api/products/:id", getSingleProduct);
router.put("/api/products/:id", upload.single("image"), protectAdmin, updateProduct);
router.delete("/api/products/:id", protectAdmin, deleteProduct);

// ---------------- ORDER ROUTES ----------------
router.post("/api/orders", protect, createOrder); // Only logged-in users should place orders

// ---------------- ADMIN ROUTES ----------------
router.get("/api/admin/users", protectAdmin, getAllUsersWithOrders);

module.exports = router;