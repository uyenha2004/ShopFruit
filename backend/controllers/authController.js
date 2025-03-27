// controllers/authController.js
const User = require('../models/user'); // Mô hình người dùng
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Kiểm tra xem email đã được sử dụng chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới với vai trò mặc định là 'user'
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user', // Cấp quyền mặc định là 'user', có thể thay đổi nếu cần
        });

        // Lưu người dùng mới vào cơ sở dữ liệu
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

        const role = user.role || 'user'; // Giả sử có thuộc tính `role` trong mô hình người dùng
        const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
