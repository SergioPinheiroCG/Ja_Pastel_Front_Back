//back/router/cartRouter.js
const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação ; 

// Adicione o middleware de autenticação nas rotas que precisam
router.post('/add', WithAuth, cartController.addToCart);
router.post('/finalizar', WithAuth, cartController.finalizarPedido); // Nova rota
router.delete('/remove/:id', WithAuth, cartController.removeFromCart);
router.put('/update/:id', WithAuth, cartController.updateQuantity);
router.get('/items', WithAuth, cartController.getCartItems); // Removi :usuarioId

module.exports = router;
