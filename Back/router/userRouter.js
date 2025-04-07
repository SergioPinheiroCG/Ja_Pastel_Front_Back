//back/router/userRouter.js

const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const WithAuth = require("../middleware/auth"); // Importando o middleware de autenticação

router.post("/register", userController.register); // Rota de registro
router.post("/login", userController.login); // Rota de login
router.get('/me', WithAuth, userController.getMe); 

module.exports = router;