const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável uma instância de "Express Router" ; 
const pedidoController = require("../controller/pedidoController"); // Importando o controller de pedidos ; 

const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação ; 

router.get("/pedido", WithAuth, pedidoController.getPedidos); // Rota de "GET" ; 
router.post("/pedido", WithAuth, pedidoController.addPedido); // Rota de "POST" ; 
router.delete("/pedido/:id", WithAuth, pedidoController.deletePedido); // Rota de "DELETE" ; 
router.put("/pedido/:id", WithAuth, pedidoController.putPedido); // Rota de "PUT" ; 

module.exports = router; // Exportando o router para ser utilizado no Index ; 