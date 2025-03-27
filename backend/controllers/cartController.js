const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng trống.' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addItemToCart = async (req, res) => {
    const { userId, productId, name, price, imageUrl, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalQuantity: 0, totalPrice: 0 });
        }

        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newItem = new CartItem({ productId, name, price, imageUrl, quantity });
            cart.items.push(newItem);
        }

        cart.totalQuantity += quantity;
        cart.totalPrice += price * quantity;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeItemFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' });

        const itemToRemove = cart.items[itemIndex];
        cart.totalQuantity -= itemToRemove.quantity;
        cart.totalPrice -= itemToRemove.price * itemToRemove.quantity;
        cart.items.splice(itemIndex, 1);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

// Cập nhật số lượng sản phẩm
exports.updateQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });

        const item = cart.items.find(item => item.productId === productId);
        if (!item) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng.' });

        cart.totalQuantity += quantity - item.quantity;
        cart.totalPrice += (quantity - item.quantity) * item.price;
        item.quantity = quantity;

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại.' });

        cart.items = [];
        cart.totalQuantity = 0;
        cart.totalPrice = 0;
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};
