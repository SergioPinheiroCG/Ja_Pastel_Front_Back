const {mongoose} = require("mongoose");
const Comentario = require("../model/Comentario"); // Importando o model de comentários ; 
const User = require("../model/User"); // Importando o model de usuário ; 

const getComentarios = async (req, res) => { // Função responsável por selecionar todos os comentários cadastrados no banco de dados ; 
    try {
        const comentarios = await Comentario.find().populate("usuario"); // Selecionando todos os comentários cadastrados e atribuindo a variável ; 
        return res.status(200).json(comentarios); // Retornando todos os comentários cadastrados no banco de dados ; 
    }
    catch (error) {
        res.status(500).json({message: "Erro interno ao selecionar comentários!"}); // Atribuindo a mensagem de erro ; 
    }
}

const addComentario = async (req, res) => { // Função responsável por adicionar um comentário no banco de dados ; 
    try {

        const idUser = await recuperarIdUser(req); // Recuperando o ID do usuário logado e atribuindo a variável ; 
        const possuiComentario = await Comentario.findOne({usuario: idUser}); // Selecionando um comentário que possui referência ao ID do usuário logado ; 
        if(possuiComentario) {return res.status(400).json({message: "Erro ao adicionar comentário! O usuário já possui um comentário!"})}; // Atribuindo a mensagem de erro ; 

        const {titulo, descricao} = req.body; // Recuperando os dados digitados pelo usuário e atrubuindo as variáveis ; 
        
        if(!titulo || !descricao) {return res.status(400).json({message: "Erro ao adicionar comentário! Todos os campos precisam ser preenchidos corretamente!"})}; // Atribuindo a mensagem de erro ; 
        
        const novoComentario = await Comentario.create({titulo, descricao, usuario: idUser}); // Criando o novo comentário no banco de dados ; 

        if(novoComentario) { // Caso o comentário tenha sido criado ; 
            await User.findByIdAndUpdate(idUser, {comentario: novoComentario._id}); // Vinculando o novo comentário ao usuário ; 
            return res.status(201).json({message: "Comentário adicionado com sucesso!"}); // Atribuindo a mensagem de sucesso ; 
        }
        else {
            return res.status(400).json({message: "Erro ao adicionar comentário!"}); // Atribuindo a mensagem de erro ; 
        }
    }
    catch (error) {
        res.status(500).json({message: "Erro interno ao adicionar comentário!"}); // Atribuindo a mensagem de erro ; 
    }
}

const deleteComentario = async (req, res) => { // Função responsável por excluir um comentário no banco de dados ; 
    try {
        const {id} = req.params; // Recuperando o ID do comentário a ser excluído ; 
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({message: "Erro ao excluir comentário! O ID informado é inválido"})} // Atribuindo a mensagem de erro ; 

        const comentarioExcluido = await Comentario.findByIdAndDelete(id); // Selecionando e excluindo no banco de dados um comentário com o ID informado ; 
        if(comentarioExcluido) { // Caso o comentário tenha sido removido ; 
            await User.findOneAndUpdate({comentario: id},{$unset: {comentario: "" }})
            return res.status(200).json({message: "Comentário excluído com sucesso!"}); // Atribuindo a mensagem de sucesso ; 
        }
        else {
            return res.status(400).json({message: "Erro ao excluir comentário! Não foi possível achar nenhum comentário com o ID informado!"}); // Atribuindo a mensagem de erro ; 
        }
    }
    catch (error) {
        res.status(500).json({message: "Erro interno ao excluir comentário!"}); // Atribuindo a mensagem de erro ; 
    }
}

const putComentario = async (req, res) => { // Função responsável por atualizar um comentário no banco de dados ; 
    try {
        const {id} = req.params; // Recuperando o ID informado pelo usuário ; 
        const {titulo, descricao} = req.body; // Recuperando os dados informados pelo usuário e atribuindo as variáveis ; 

        if(!titulo || !descricao) {return res.status(400).json({message: "Erro ao atualizar comentário! Todos os campos são obrigatórios!"})}; // Atribuindo a mensagem de erro ; 
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {return res.status(400).json({message: "Erro ao atualizar comentário! O ID informado é inválido!"})}; // Atribuindo a mensagem de erro

        const comentarioExistente = await Comentario.findById(id); // Selecionando o comentário pelo ID ; 
        if(!comentarioExistente) {return res.status(400).json({message: "Erro ao atualizar comentário! Não foi encontrado nenhum comentário com o ID informado!"})}; // Atribuindo a mensagem de erro ; 
   
        const atualizarComentario = await Comentario.findByIdAndUpdate(id, {titulo, descricao}, {new: true}); // Atualizando o comentário no banco de dados ; 
        const retornoUser = atualizarComentario ? res.status(200).json({message: "Comentário atualizado com sucesso!"}) : res.status(400).json({message: "Erro ao atualizar comentário!"}); // Atribuindo a mensagem de erro ou sucesso baseado na condição ; 
        return retornoUser;
    }
    catch (error) {
        res.status(500).json({message: "Erro interno ao atualizar comentário!"}); // Atribuindo a mensagem de erro ; 
    }
}

// FUNÇÕES AUXILIARES ; 

const recuperarIdUser = async (req) => { // Função responsável por recuperar o ID do usuário que está cadastrado na requisição ; 
    try {
        const email = req.email; // Recuperando o email do usuário que está cadastrado ; 
        const user = await User.findOne({email}); // Selecionando o usuário que está cadastrado com o email informado ; 
        return user.id;
    }
    catch (error) {
        res.status(500).json({message: "Erro interno!"}); // Atribuindo a mensagem de erro ; 
    }
}

module.exports = {getComentarios, addComentario, deleteComentario, putComentario}; // Exportando as funções para serem utilizadas no controller ; 