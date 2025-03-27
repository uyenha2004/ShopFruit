const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('CartItem', CartItemSchema);
