// controllers/userController.js
const User = require('../models/user'); // Mô hình người dùng

// Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
};

// Thêm người dùng mới
exports.addUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm người dùng', error: error.message });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: error.message });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
        }
        res.json({ message: 'Người dùng đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: error.message });
    }
};
