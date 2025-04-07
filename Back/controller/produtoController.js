//back/controller/produtoController.js

const Produto = require("../model/Produto"); // Importando o model de produto ; 
const mongoose = require("mongoose"); // Importando a biblioteca "mongoose" ; 

const getProduto = async (req, res) => { // Função responsável por retornar todos os pastéis cadastrados no banco de dados ; 
    try {
        const produtos = await Produto.find();// Selecionando todos os produtos cadastrados no banco de dados e atribuindo a variável ;
        return res.status(200).json(produtos); // Retornando os produtos cadastrados no banco de dados ;  
    }
    catch(error) {
        console.error("Erro ao buscar produtos:", error); // Log do erro para depuração
        res.status(500).json({message: "Erro ao selecionar os produtos cadastrados no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}
/*
const addProduto = async (req, res) => { // Função responsável por adicionar um produto no banco de dados ; 
    try {
        const {nome, descricao, valor, = req.body; // Recuperando os dados digitados pelo usuário e atribuindo as variáveis ; 
        
        if(!nome || !descricao || !valor) {return res.status(400).json({message: "Erro ao adicionar produto! Todos os campos são obrigatórios!"})} // Atribuindo a mensagem de erro ; 
        if(isNaN(valor) || valor < 0) {return res.status(400).json({message: "Erro ao adicionar produto! O valor precisa ter um valor válido!" })} // Atribuindo a mensagem de erro ;

        const novoProduto = await Produto.create({nome, descricao, valor}); // Criando o novo produto no banco de dados ; 

        const retornoUser = novoProduto ? res.status(201).json(novoProduto) : res.status(400).json({message: "Erro ao adicionar produto! Verifique os campos e tente novamente!"}); // Atribuindo a mensagem de erro ou sucesso baseada na condição ; 
        return retornoUser;

    }
    catch(error) {
        res.status(500).json({message: "Erro ao adicionar produto no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}*/

const addProduto = async (req, res) => {
    try {
        const {nome, descricao, valor, imagem} = req.body;
        
        if(!nome || !descricao || !valor) {
            return res.status(400).json({message: "Campos obrigatórios faltando!"});
        }

        const novoProduto = await Produto.create({
            nome, 
            descricao, 
            valor,
            imagem: imagem || null // Armazena null se não houver imagem
        });

        return res.status(201).json(novoProduto);
    }
    catch(error) {
        res.status(500).json({message: "Erro ao adicionar produto!"});
    }
}

const deleteProduto = async (req, res) => { // Função responsável por deletar um produto no banco de dados ; 
    try {
        const {id} = req.params; // Recuperando o ID do produto a ser excluído ; 
        
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({message: "Erro ao excluir pastel! O ID precisa ter um valor válido!"})}; // Atribuindo a mensagem de erro ; 

        // IMPLEMENTAR LÓGICA DE NÃO PERMITIR EXCLUSÃO DE PRODUTO CASO ELE ESTEJA VINCULADO A ALGUM PEDIDO ; 

        const excluirProduto = await Produto.findByIdAndDelete(id); // Excluindo um produto no banco de dados com o ID informado ; 

        const retornoUser = excluirProduto ? res.status(200).json({message: "Produto excluído com sucesso!"}) : res.status(400).json({message: "Erro ao excluir protuo! Não foi encontrado nenhum produto com o ID informado!"}); // Atribuindo a mensagem de erro ou sucesso baseada na condição ;  
        return retornoUser;
    }
    catch (error) {
        res.status(500).json({message: "Erro ao excluir produto no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}

const putProduto = async (req, res) => {
    try {
        const {id} = req.params;
        const {nome, descricao, valor, imagem} = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "ID inválido!"});
        }

        const produtoAtualizado = await Produto.findByIdAndUpdate(
            id,
            {nome, descricao, valor, imagem},
            {new: true} // Retorna o documento atualizado
        );

        if(!produtoAtualizado) {
            return res.status(404).json({message: "Produto não encontrado!"});
        }

        return res.status(200).json(produtoAtualizado);
    }
    catch(error) {
        res.status(500).json({message: "Erro ao atualizar produto!"});
    }
}

module.exports = {getProduto, addProduto, deleteProduto, putProduto}; // Exportando as funções para serem utilizadas no router ; 