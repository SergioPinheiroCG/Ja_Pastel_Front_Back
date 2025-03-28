const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação

router.post("/register", userController.register); // Rota de registro
router.post("/login", userController.login); // Rota de login
router.get('/me', WithAuth, userController.getMe); 

/*
// Nova rota para buscar dados do usuário autenticado
router.get("/me", WithAuth, async (req, res) => {
    try {
        const usuario = await User.findOne({ email: req.email }); // Busca o usuário no banco

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.json({ user: { email: usuario.email, nome: usuario.nome } }); // Agora retorna o nome!
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});*/

module.exports = router;