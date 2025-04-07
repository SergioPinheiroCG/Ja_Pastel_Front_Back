//back/database/db.js

let mongoose = require("mongoose"); // Importando a biblioteca "Mongoose"; 

const server = "localhost:27017"; // Atribuindo a variável o Server do banco de dados ; 
const database = "Ja_Pastel"; // Atribuindo a variável o nome da coleção do banco de dados ; 

class Database{
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb://${server}/${database}`)
        .then(() => console.log("Banco de dados conectado com sucesso!")) // Atribuindo a mensagem em caso de sucesso na conexão ; 
        .catch(err => {console.log("Erro na conexão com o banco de dados: " + err)}) // Atribuindo a mensagem em caso de erro na conexão ; 
    }
}

module.exports = new Database(); // Exporando a conexão com o banco de dados;