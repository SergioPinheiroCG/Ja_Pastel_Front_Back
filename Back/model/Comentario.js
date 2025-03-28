const mongoose = require("mongoose"); // Importando a biblioteca "Mongoose" ; 

const comentarioSchema = new mongoose.Schema({ // Criando a tabela no banco de dados ; 
    titulo: {type: String, required: true}, // Criando o campo "Título" ; 
    descricao: {type: String, required: true}, // Criando o campo "Descrição" ; 
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true} // Criando o campo "Usuário" ; 
})

module.exports = mongoose.model("Comentario", comentarioSchema); // Exportando o model de Comentario ; 