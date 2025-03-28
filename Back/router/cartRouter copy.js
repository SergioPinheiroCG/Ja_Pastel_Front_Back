const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/add', cartController.addToCart);
router.delete('/remove/:id', cartController.removeFromCart);
router.put('/update/:id', cartController.updateQuantity);
router.get('/items/:usuarioId', cartController.getCartItems);

module.exports = router;
