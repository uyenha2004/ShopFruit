// seedProducts.js
const mongoose = require('mongoose');
const Product = require('./models/product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Kết nối tới MongoDB thành công');
})
.catch((error) => {
    console.error('Lỗi kết nối tới MongoDB:', error);
});

const products = [
    {
        name: "Táo Fuji",
        price: 50000,
        description: "Táo Fuji ngọt, giòn, giàu dinh dưỡng",
        imageUrl: "https://link-to-image.com/tao-fuji.jpg",
        category: "Trái cây",
        inStock: true,
        isBestSeller: true,
        isOnSale: false,
        discountPrice: 45000
    },
    {
        name: "Xoài Cát Hòa Lộc",
        price: 75000,
        description: "Xoài Cát Hoà Lộc ngọt thơm, chín mọng, là lựa chọn tuyệt vời cho mùa hè",
        imageUrl: "https://link-to-image.com/xoai-cat-hoa-loc.jpg",
        category: "Trái cây",
        inStock: true,
        isBestSeller: false,
        isOnSale: true,
        discountPrice: 70000
    }
];

const seedProducts = async () => {
    try {
        await Product.deleteMany(); // Xóa tất cả các sản phẩm hiện có (tùy chọn)
        await Product.insertMany(products); // Thêm sản phẩm vào DB
        console.log('Thêm sản phẩm thành công');
        mongoose.connection.close(); // Đóng kết nối MongoDB sau khi hoàn thành
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
    }
};

seedProducts();
