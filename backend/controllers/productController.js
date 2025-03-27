// controllers/productController.js
const Product = require('../models/product'); // Mô hình sản phẩm
const fs = require('fs');
const path = require('path');
// Lấy danh sách sản phẩm với phân trang
exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // Mặc định mỗi trang có 12 sản phẩm
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find().skip(skip).limit(limit);
        const total = await Product.countDocuments();

        res.json({
            products,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// API để lấy danh sách sản phẩm từ file JSON
exports.getProducts = (req, res) => {
    const filePath = path.join(__dirname, '../data/products.json');
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đọc file dữ liệu', error: err.message });
        }
        
        const products = JSON.parse(data);
        res.json(products);
    });
};

// Lấy thông tin chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Lấy danh sách sản phẩm bán chạy
exports.getBestSellers = async (req, res) => {
    try {
        const bestSellers = await Product.find({ isBestSeller: true });
        res.json(bestSellers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Lấy danh sách sản phẩm đang giảm giá
exports.getOnSaleProducts = async (req, res) => {
    try {
        const onSaleProducts = await Product.find({ isOnSale: true });
        res.json(onSaleProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Lấy danh sách sản phẩm mới nhất
exports.getLatestProducts = async (req, res) => {
    try {
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
        res.json(latestProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Thêm sản phẩm mới
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
};

// Cập nhật sản phẩm theo ID
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
};

// Xóa sản phẩm theo ID
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }
        res.json({ message: 'Sản phẩm đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
};
