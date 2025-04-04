// IMPORT DE BIBLITOECAS ;
const express = require("express"); // Importando a biblioteca "Express" ;
const bodyParser = require("body-parser"); // Importando a biblioteca "BodyParser" ;
const cors = require("cors");



// IMPORT DE ARQUIVOS ;
const db = require("./database/db"); // Importando a conexão com o banco de dados ;
const userRouter = require("./router/userRouter"); // Importando o router de usuário ;
const produtoRouter = require("./router/produtoRouter"); // Importando o router de pastel ;
const pedidoRouter = require("./router/pedidoRouter"); // Importando o router de pedido ;
const cartRouter = require("./router/cartRouter"); // Importando o router de cart ;
const comprasRouter = require("./router/comprasRouter");

// UTILIZAÇÃO DE BIBLIOTECAS ;
const app = express(); // Atribuindo a variável uma instância de "Express" ;
app.use(bodyParser.json()); // Fazendo com que o corpo das requisições sejam lidos como JSON ;
app.use(express.json()); // Garante que o corpo da requisição seja interpretado corretamente ;
app.use(bodyParser.urlencoded({ extended: true })); // Permite dados de formulário
app.use(cors());

// MIDDLEWARE DE LOG AQUi:
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// UTILIZAÇÃO DE ARQUIVOS ;
app.use("/api/compras", comprasRouter); // Utilizando o router de compras ;
app.use("/api/", pedidoRouter); // Utilizando o router de pedido ;
app.use("/api", userRouter); // Utilizando o router de usuário ;
app.use("/api", produtoRouter); // Utilizando o router de pastel ;
app.use("/api", cartRouter); // Utilizando o router de cart ;


// SERVIDOR ;
const ipAddress = "192.168.0.7"; // Atribuindo a variável o endereço IP do servidor ;
const port = 5000; // Atribuindo a variável a porta no qual será rodado o servidor ;
app.listen(port, ipAddress, () => {
  // Iniciando o servidor ;
  console.log(`Servidor rodando em http://${ipAddress}:${port}`);
});