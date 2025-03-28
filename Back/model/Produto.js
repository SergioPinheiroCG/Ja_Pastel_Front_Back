const mongoose = require("mongoose"); // Importando a biblioteca "Mongoose" ; 

const produtoSchema = new mongoose.Schema({ // Criando a tabela no banco de dados ; 
    nome: {type: String, required: true}, // Criando o campo "Nome" ; 
    descricao: {type: String, required: true}, // Criando o campo "Descrição" ; 
    valor: {type: Number, required: true}, // Criando o campo "Valor" ; 
    imagem: String,
})

module.exports = mongoose.model("Produto", produtoSchema); // Exportando o model de produto ; 