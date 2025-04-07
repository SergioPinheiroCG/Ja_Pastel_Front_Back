//back/router/comprasRouter.js
const express = require("express");
const router = express.Router();
const comprasController = require("../controller/comprasController");


// Registrar compra para processamento por IA
router.post("/", comprasController.criarCompra);
// Listar todas as compras
router.get("/", comprasController.listarCompras);
// Atualizar uma compra
router.put("/:id", comprasController.atualizarCompra);
// Deletar uma compra
router.delete("/:id", comprasController.deletarCompra);

module.exports = router;