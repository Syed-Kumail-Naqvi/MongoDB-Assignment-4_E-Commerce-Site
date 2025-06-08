const Order = require("../models/orderModel"); // Corrected to use orderModel.js as per your filename
const Product = require('../models/Product'); // Assuming you have a Product model to validate product IDs
const User = require('../models/user');     // Assuming you have a User model for population

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private (User only)
 */
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No products in order!" });
        }

        // Validate each product in the order and ensure it exists
        for (const item of products) {
            const productExists = await Product.findById(item.product);
            if (!productExists) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            // Optional: You could add stock management here (decrease stock)
            // if (productExists.stock < item.quantity) {
            //   return res.status(400).json({ message: `Insufficient stock for product ${productExists.name}` });
            // }
            // productExists.stock -= item.quantity;
            // await productExists.save();
        }

        const order = new Order({
            user: req.user._id, // User ID from authenticated request (assuming `protect` middleware sets `req.user`)
            products,           // This array contains { product: ObjectId, quantity: Number }
            shippingAddress,
            paymentMethod,
            totalAmount,
            // paidAt is set by `Date.now()` as per your provided createOrder,
            // assuming payment occurs at the time of order creation.
            // If payment is separate (e.g., COD marked paid upon delivery), this should be handled elsewhere.
            paidAt: Date.now(),
            status: 'Pending' // Explicitly set default status, though schema handles it
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: "Server Error during order creation" });
    }
};

/**
 * @desc    Get all orders (for Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
    try {
        // Populate user details (name and email)
        // For products, populate the 'product' field within the 'products' array
        // to get details like 'name' and 'image' from the 'Product' model.
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('products.product', 'name image') // Populates product details
            .sort({ createdAt: -1 }); // Sort by most recent first

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};

/**
 * @desc    Get order by ID (for User or Admin)
 * @route   GET /api/orders/:id
 * @access  Private (User or Admin)
 */
const getOrderById = async (req, res) => {
    try {
        // Populate user details and product details within the order
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('products.product', 'name image'); // Populates product details

        if (order) {
            // Ensure only the order owner or an admin can view the order
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.status(200).json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to view this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Failed to fetch order', error: error.message });
    }
};

/**
 * @desc    Update order status (for Admin only)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    const { status } = req.body; // New status from the request body

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Validate the new status against allowed enum values from the schema
        const allowedStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status provided' });
        }

        order.status = status;

        // If the order is marked as 'Delivered', set deliveredAt timestamp
        if (status === 'Delivered' && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};