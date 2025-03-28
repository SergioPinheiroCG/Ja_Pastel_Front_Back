const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável uma instância de "Express Router" ; 
const produtoController = require("../controller/produtoController"); // Importando o controller de produto; 

const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação ; 

router.get("/produto", WithAuth, produtoController.getProduto); // Rota de "GET" ; 
router.post("/produto", WithAuth, produtoController.addProduto); // Rota de "POST" ; 
router.delete("/produto/:id", WithAuth, produtoController.deleteProduto); // Rota de "DELETE" ; 
router.put("/produto/:id", WithAuth, produtoController.putProduto); // Rota de "PUT" ; 

module.exports = router; // Exportando o router para ser utilizado no Index ; 