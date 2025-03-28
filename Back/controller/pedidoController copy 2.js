// controller/pedidoController.js
const Pedido = require("../model/Pedido");
const Produto = require("../model/Produto");
const mongoose = require("mongoose");

const getPedidos = async (req, res) => {
  try {
    const idUser = await recuperarIdUser(req);
    const pedidos = await Pedido.find({ usuario: idUser })
      .populate("produtos")
      .populate("usuario");
    return res.status(200).json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

const addPedido = async (req, res) => {
  try {
    const { produtos, formaPagamento, valorTotal } = req.body;
    const idUser = req.user.id;

    if (!produtos || !Array.isArray(produtos)) {
      return res.status(400).json({ message: "Lista de produtos inválida" });
    }

    if (produtos.length === 0) {
      return res.status(400).json({ message: "Nenhum produto no pedido" });
    }

    const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (produtosValidos.length !== produtos.length) {
      return res.status(400).json({ message: "IDs de produtos inválidos" });
    }

    const produtosEncontrados = await Produto.find({ _id: { $in: produtosValidos } });
    if (produtosEncontrados.length === 0) {
      return res.status(404).json({ message: "Produtos não encontrados" });
    }

    const totalCalculado = produtosEncontrados.reduce((total, produto) => {
      return total + Number(produto.valor) || 0;
    }, 0);

    const novoPedido = await Pedido.create({
      produtos: produtosValidos,
      usuario: idUser,
      valor: valorTotal || totalCalculado,
      formaPagamento,
      status: "pendente",
      data: new Date()
    });

    res.status(201).json(novoPedido);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const pedidoDeletado = await Pedido.findByIdAndDelete(id);
    
    if (pedidoDeletado) {
      return res.status(200).json({ message: "Pedido deletado" });
    } else {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar pedido", error: error.message });
  }
};

const putPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { produtos } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    if (!produtos || !Array.isArray(produtos)) {
      return res.status(400).json({ message: "Lista de produtos inválida" });
    }

    const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (produtosValidos.length !== produtos.length) {
      return res.status(400).json({ message: "IDs de produtos inválidos" });
    }

    const produtosEncontrados = await Produto.find({ _id: { $in: produtosValidos } });
    if (produtosEncontrados.length === 0) {
      return res.status(404).json({ message: "Produtos não encontrados" });
    }

    const totalCalculado = produtosEncontrados.reduce((total, produto) => {
      return total + Number(produto.valor) || 0;
    }, 0);

    const pedidoAtualizado = await Pedido.findByIdAndUpdate(
      id,
      { produtos: produtosValidos, valor: totalCalculado },
      { new: true }
    );

    if (pedidoAtualizado) {
      return res.status(200).json(pedidoAtualizado);
    } else {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar pedido", error: error.message });
  }
};

const recuperarIdUser = async (req) => {
  return req.user.id;
};

module.exports = {
  getPedidos,
  addPedido,
  deletePedido,
  putPedido
};