const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável uma instância de "Express Router" ; 
const comentarioController = require("../controller/comentarioController"); // Importando o controller de comentário ; 

const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação ; 

router.get("/comentario", WithAuth, comentarioController.getComentarios); // Rota de "GET" ; 
router.post("/comentario", WithAuth, comentarioController.addComentario); // Rota de "POST" ; 
router.delete("/comentario/:id", WithAuth, comentarioController.deleteComentario); // Rota de "DELETE" ; 
router.put("/comentario/:id", WithAuth, comentarioController.putComentario); // Rota de "PUT" ; 


module.exports = router; // Exportando o router de comentários ;