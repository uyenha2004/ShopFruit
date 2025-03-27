const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.get('/:userId', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.post('/remove', cartController.removeItemFromCart);
router.post('/update-quantity', cartController.updateQuantity);
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
