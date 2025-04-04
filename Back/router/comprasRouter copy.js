const express = require("express");
const router = express.Router();
const comprasController = require("../controller/comprasController");


// Registrar compra para processamento por IA
router.post("/compras", comprasController.criarCompra);
// Listar todas as compras
router.get("/compras", comprasController.listarCompras);
// Atualizar uma compra
router.put("/compras/:id", comprasController.atualizarCompra);
// Deletar uma compra
router.delete("/compras/:id", comprasController.deletarCompra);

module.exports = router;