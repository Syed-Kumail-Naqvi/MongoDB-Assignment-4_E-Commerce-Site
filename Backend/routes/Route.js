const express = require("express");
const router = express.Router();

// Controllers
const { 
    registerUser, 
    loginUser, 
    adminLoginUser,
    getProfile,         // <--- NEW: Import getProfile controller
    updateProfile,      // <--- NEW: Import updateProfile controller
    uploadProfileImage  // <--- NEW: Import uploadProfileImage controller
} = require("../controllers/authController");

const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { createOrder } = require("../controllers/orderController");
const { getAllUsersWithOrders, deleteUser } = require("../controllers/adminController");

// ---------------- MIDDLEWARE -------------------
const { protect, protectAdmin } = require("../middleware/middleware");
const productUpload = require("../middleware/multer"); // Your existing Multer middleware for products
const profileUpload = require("../middleware/profileUpload"); // <--- NEW: Import Multer middleware for profile images

// ---------------- AUTH ROUTES -------------------
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post('/auth/admin/login', adminLoginUser);

// --- NEW: User Profile Routes (Protected) ---
router.get("/auth/profile", protect, getProfile); // Get user profile
router.put("/auth/profile", protect, updateProfile); // Update user profile details (name, email, password)

// Route for uploading user profile image (protected and uses profileUpload middleware)
router.post("/auth/profile/image", protect, (req, res, next) => {
    // Wrap the 'profileUpload' middleware with custom error handling for Multer-specific errors
    profileUpload.single('profileImage')(req, res, function (err) { // 'profileImage' is the field name for the file
        if (err instanceof require('multer').MulterError) {
            // A Multer error occurred (e.g., file too large, invalid type)
            console.error("Profile Image Multer Error:", err.message);
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            // An unknown error occurred during upload
            console.error("Unknown Profile Image Upload Error:", err);
            return res.status(500).json({ success: false, message: "Error uploading profile image." });
        }
        // If no error, proceed to the next middleware (uploadProfileImage controller)
        next();
    });
}, uploadProfileImage);


// ---------------- PRODUCT ROUTES ----------------

// Route for creating a product (protected by admin middleware and uses multer for image upload)
router.post("/products", protectAdmin, (req, res, next) => {
    // Wrap the 'productUpload' middleware with custom error handling for Multer-specific errors
    productUpload(req, res, function (err) {
        if (err instanceof require('multer').MulterError) {
            // A Multer error occurred (e.g., file too large, invalid type)
            console.error("Product Multer Error:", err.message);
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            // An unknown error occurred during upload
            console.error("Unknown Product Upload Error:", err);
            return res.status(500).json({ success: false, message: "Error uploading file." });
        }
        // If no error, proceed to the next middleware (createProduct controller)
        next();
    });
}, createProduct);

// Route for updating a product (protected by admin middleware and uses multer for image upload)
router.put("/products/:id", protectAdmin, (req, res, next) => {
    // Apply the same custom error handling for updates
    productUpload(req, res, function (err) {
        if (err instanceof require('multer').MulterError) {
            console.error("Product Multer Error:", err.message);
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            console.error("Unknown Product Upload Error:", err);
            return res.status(500).json({ success: false, message: "Error uploading file." });
        }
        next();
    });
}, updateProduct);

// Routes for getting products (publicly accessible)
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);

// Route for deleting a product (protected by admin middleware)
router.delete("/products/:id", protectAdmin, deleteProduct);

// ---------------- ORDER ROUTES ----------------
// Route for creating an order (protected for authenticated users)
router.post("/orders", protect, createOrder);

// ---------------- ADMIN ROUTES ----------------
// Route for getting all users with their orders (protected for admin users)
router.get("/admin/users", protectAdmin, getAllUsersWithOrders);

// Route for deleting a user by ID (protected for admin users)
router.delete("/admin/users/:id", protect, protectAdmin, deleteUser);

module.exports = router;