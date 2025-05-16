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
const { adminLoginUser } = require("../controllers/authController");

// ---------------- MIDDLEWARE -------------------
const { protect, protectAdmin } = require("../middleware/middleware");
const upload = require("../middleware/multer");

// ---------------- AUTH ROUTES -------------------
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post('/auth/admin/login', adminLoginUser);

// ---------------- PRODUCT ROUTES ----------------
router.post("/products", upload.single("image"), protectAdmin, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.put("/products/:id", upload.single("image"), protectAdmin, updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

// ---------------- ORDER ROUTES ----------------
router.post("/orders", protect, createOrder); // Only logged-in users should place orders

// ---------------- ADMIN ROUTES ----------------
router.get("/admin/users", protectAdmin, getAllUsersWithOrders);

module.exports = router;