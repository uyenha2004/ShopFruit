// controllers/dashboardController.js
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

exports.getDashboardStats = async (req, res) => {
    try {
        // Tổng doanh thu từ các đơn hàng
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // Số lượng sản phẩm
        const productCount = await Product.countDocuments();

        // Số lượng người dùng
        const userCount = await User.countDocuments();

        res.json({
            totalRevenue: totalRevenue[0]?.total || 0,
            productCount,
            userCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê', error });
    }
};
