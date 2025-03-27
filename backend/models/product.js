// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },  // Thêm thuộc tính description
    imageUrl: { type: String },
    category: { type: String },
    inStock: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    discountPrice: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
