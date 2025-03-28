const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável uma instância de "Express Router" ; 
const pedidoController = require("../controller/pedidoController"); // Importando o controller de pedidos ; 

const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação ; 

router.get("/pedidos", WithAuth, pedidoController.getPedidos); // Rota de "GET" ; 
router.post("/pedidos", WithAuth, pedidoController.addPedido); // Rota de "POST" ; 
router.delete("/pedidos/:id", WithAuth, pedidoController.deletePedido); // Rota de "DELETE" ; 
router.put("/pedidos/:id", WithAuth, pedidoController.putPedido); // Rota de "PUT" ; 

module.exports = router; // Exportando o router para ser utilizado no Index ; 