const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware"); // For JWT user auth

// Create Order Route (User only)
router.post("/", protect, createOrder);

module.exports = router;