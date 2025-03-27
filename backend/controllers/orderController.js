// controllers/orderController.js
const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    const { items, total, address, paymentMethod, status, date } = req.body;
    try {
        const newOrder = new Order({
            userId: req.user.id, // Thay thế bằng id người dùng hiện tại
            items,
            total,
            address,
            paymentMethod,
            status,
            date,
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
