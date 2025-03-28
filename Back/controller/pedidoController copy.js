const Pedido = require("../model/Pedido"); // Importando o model de "pedidos" ; 
const Produto = require("../model/Produto"); // Importando o model de "produto" ; 
const User = require("../model/User"); // Importando o model de "usuário" ; 
const mongoose = require("mongoose"); // Importando o "mongoose" ; 

const getPedidos = async (req, res) => { // Função responsável por selecionar todos os pedidos cadastrados no banco de dados ; 
    try {
        const idUser = await recuperarIdUser(req); // Recuperando o ID do usuário cadastrado na requisição ; 
        const pedidos = await Pedido.find({usuario: idUser}).populate("produtos").populate("usuario"); // Selecionando todos os pedidos cadastrados no banco de dados vinculados ao usuário logado no Sistema; 
        return res.status(200).json(pedidos); // Retornando todos os pedidos cadastrados no banco de dados ; 
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: "Erro interno ao selecionar pedidos cadastrados no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}

const addPedido = async (req, res) => { // Função responsável por adicionar um pedido no banco de dados ; 
    try {
        const { produtos } = req.body; // Recuperando o ID dos produtos a serem adicionados ao pedido ; 
        const idUser = await recuperarIdUser(req); // Recuperando o ID do usuário que está logado no sistema ; 

        if (!produtos || !Array.isArray(produtos)) {return res.status(400).json({ message: "Erro ao adicionar pedido no banco de dados!"})} // Atribuindo a mensagem de erro ; 
        if (produtos.length === 0) { return res.status(400).json({ message: "Erro ao adicionar pedido no banco de dados! O pedido precisa de ao menos um produto para ser cadastrado!" })} // Atribuindo a mensagem de erro ; 

        const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id)); // Filtrando os produtos em que os ID são objetos válidos ; 
        if (produtosValidos.length !== produtos.length) {return res.status(400).json({ message: "Erro ao adicionar pedido no banco de dados! Um ou mais ID de produtos são inválidos!" })} // Atribuindo a mensagem de erro ; 

        const produtosEncontrados = await Produto.find({ _id: { $in: produtosValidos } }); // Fazendo a busca de produtos no banco de dados ; 
        if (produtosEncontrados.length === 0) {return res.status(400).json({ message: "Erro ao adicionar pedido no banco de dados! Nenhum produto válido foi encontrado!" })} // Atribuindo a mensaegm de erro ; 

        let valorTotal = produtosEncontrados.reduce((total, produto) => { // Calculando o valor total do pedido ; 
            return total + Number(produto.valor) || 0
        }, 0);

        const novoPedido = await Pedido.create({produtos: produtosValidos, usuario: idUser, valor: valorTotal}); // Criando o pedido no banco de dados; 


        if (novoPedido) { // Se o pedido for criado com sucesso ; 
            await User.findByIdAndUpdate(idUser, { $push: { pedidos: novoPedido._id } }); // Associando o pedido ao usuário correspondente ; 
            return res.status(201).json(novoPedido); // Atribuindo a mensagem de sucesso ;  
        } else {
            return res.status(400).json({ message: "Erro ao adicionar pedido no banco de dados" }); // Atribuindo a mensagem de erro ; 
        }
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao adicionar pedido no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
};

const deletePedido = async (req, res) => { // Função responsável por deletar um pedido no banco de dados ; 
    try {
        const {id} = req.params; // Recuperando o ID do pedido a ser removido ; 
        
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({message: "Erro ao deletar pedido! O ID informado é inválido!"})}; // Atribuindo a mensagem de erro ; 

        const pedidoDeletado = await Pedido.findByIdAndDelete(id); // Procurando e deletando o pedido no banco de dados ; 
        
        if(pedidoDeletado) { // Se o pedido foi deletado com sucesso ;
            const idUser = await recuperarIdUser(req); // Recuperando o ID do usuário e atribuindo a variável ; 
            await User.findByIdAndUpdate(idUser, {$pull: {pedidos: pedidoDeletado._id}}) // Removendo o pedido do array de pedidos do usuário ; 
            return res.status(200).json({message: "Pedido deletado com sucesso!"}); // Atribuindo a mensagem de sucesso ; 
        }
        else { // Caso não tenha sido deletado ; 
            return res.status(400).json({message: "Erro ao deletar pedido! Não foi encontrado nenhum pedido com o ID informado!"}); // Atribuindo a mensagem de erro ; 
        }
    }
    catch(error) {
        res.status(500).json({message: "Erro interno ao deletar pedido no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}

const putPedido = async (req, res) => { // Função responsável por atualizar um pedido no banco de dados ; 
    try {
        const {id} = req.params; // Recuperando o ID do pedido a ser atualizado ; 
        const {produtos} = req.body; // Recuperando o ID dos produtos a serem atualizados no pedido ; 

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({message: "Erro ao atualizar pedido! O ID informado é inválido!"})}; // Atribuindo a mensagem de erro ; 
    
        if (!produtos || !Array.isArray(produtos)) {return res.status(400).json({ message: "Erro ao atualizar pedido no banco de dados!" })} // Atribuindo a mensagem de erro ; 
        if (produtos.length === 0) { return res.status(400).json({ message: "Erro ao atualizar pedido no banco de dados! O pedido precisa de ao menos um produto para ser atualizado!" })} // Atribuindo a mensagem de erro ; 

        const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id)); // Filtrando os produtos em que os ID são objetos válidos ; 
        if (produtosValidos.length !== produtos.length) {return res.status(400).json({ message: "Erro ao atualizar pedido no banco de dados! Um ou mais ID de produtos são inválidos!" })} // Atribuindo a mensagem de erro ; 

        const produtosEncontrados = await Produto.find({ _id: { $in: produtosValidos } }); // Fazendo a busca de produtos no banco de dados ; 
        if (produtosEncontrados.length === 0) {return res.status(400).json({ message: "Erro ao atualizar pedido no banco de dados! Nenhum produto válido foi encontrado!" })} // Atribuindo a mensaegm de erro ; 

        let valorTotal = produtosEncontrados.reduce((total, produto) => { // Calculando o valor total do pedido ; 
            return total + Number(produto.valor) || 0
        }, 0);

        const pedidoAtualizado = await Pedido.findByIdAndUpdate(id, {produtos: produtosValidos, valor: valorTotal}); // Atualizando o pedido no banco de dados ; 

        if(pedidoAtualizado) { // Caso o pedido tenha sido atualizado com sucesso ; 
            return res.status(200).json({message: "Pedido atualizado com sucesso!"}); // Atribuindo a mensagem de sucesso ; 
        }
        else { // Caso não tenha sido atualizado ; 
            return res.status(400).json({message: "Erro ao atualizar pedido no banco de dados!"}); // Atribuindo a mensagem de erro ; 
        }  
    }
    catch(error) {
        res.status(500).json({message: "Erro interno ao atualizar pedido no banco de dados!"}); // Atribuindo a mensagem de erro ; 
    }
}

// FUNÇÕES AUXILIARES ; 

const recuperarIdUser = async (req) => { // Função responsável por recuperar o ID do usuário que está cadastrado na requisição ; 
    try {
        const email = req.email; // Recuperando o email do usuário que está cadastrado ; 
        const user = await User.findOne({email}); // Selecionando o usuário que está cadastrado com o email informado ; 
        return user.id; // Retornando o ID do usuário ; 
    }
    catch (error) {
        res.status(500).json({message: "Erro interno!"}); // Atribuindo a mensagem de erro ; 
    }
}

module.exports = {getPedidos, addPedido, deletePedido, putPedido}; // Exportando as  funções para serem utilizadas no router ; 
