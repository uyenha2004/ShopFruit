// routes/productRoutes.js
const express = require('express');
const { getBestSellers, getOnSaleProducts, getLatestProducts, getProducts, getProductById } = require('../controllers/productController');
const router = express.Router();

router.get('/best-sellers', getBestSellers);       // Lấy danh sách sản phẩm bán chạy
router.get('/on-sale', getOnSaleProducts);         // Lấy danh sách sản phẩm đang giảm giá
router.get('/latest', getLatestProducts);  
router.get('/:id', getProductById); // Lấy danh sách sản phẩm mới nhất
router.get('/', getProducts);     
router.get('/', productController.getProducts);
router.post('/', productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);                 // Route mặc định lấy danh sách sản phẩm với phân trang

module.exports = router;
