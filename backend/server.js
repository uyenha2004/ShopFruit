const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

app.use('/api', middlewares);
app.use('/api', router);

// Endpoint cập nhật thông tin người dùng (đổi mật khẩu)
app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = router.db.get('users').find({ id }).value();

    if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    try {
        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới và xóa trường oldPassword, newPassword
        router.db.get('users')
            .find({ id })
            .assign({ password: hashedPassword })
            .omit(['oldPassword', 'newPassword'])
            .write();

        res.json({ message: 'Mật khẩu đã được cập nhật thành công!' });
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đổi mật khẩu.' });
    }
});


// Endpoint đăng nhập
app.get('/users', async (req, res) => {
    const { email, password } = req.query;

    const user = router.db.get('users').find({ email }).value();

    if (!user) {
        return res.status(401).json({ message: 'Email không tồn tại.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng.' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            username: user.username,
            phone: user.phone,
            address: user.address,
        });
    } catch (error) {
        console.error('Lỗi xác thực:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xác thực.' });
    }
});



// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});
