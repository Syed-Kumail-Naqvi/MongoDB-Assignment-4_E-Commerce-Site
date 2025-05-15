const Order = require("../models/orderModel");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User only)
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No Products In Order!" });
        }

        const order = new Order({
            user: req.user._id,
            products,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paidAt: Date.now(),
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ Message: "Server Error" });
    }
};

module.exports = {
    createOrder,
};