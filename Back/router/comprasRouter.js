const express = require("express");
const router = express.Router();
const comprasController = require("../controller/comprasController");
const WithAuth = require("../middleware/auth");

// Registrar compra para processamento por IA
router.post("/registrar", WithAuth, comprasController.registrarCompra);

// Rota para a IA buscar compras pendentes (sem auth para acesso interno)
router.get("/para-ia", comprasController.obterComprasParaIA);

// Rota para a IA marcar como processada (sem auth para acesso interno)
router.post("/marcar-processado", comprasController.marcarComoProcessado);

module.exports = router;