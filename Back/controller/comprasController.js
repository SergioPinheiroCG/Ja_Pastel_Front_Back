const Compra = require("../model/Compras");
const Pedido = require("../model/Pedido");
const WithAuth = require("../middleware/auth");
const mongoose = require("mongoose");

const registrarCompra = async (req, res) => {
  try {
    const { pedidoId } = req.body;
    const idUser = req.user.id;

    // Validar ID do pedido
    if (!mongoose.Types.ObjectId.isValid(pedidoId)) {
      return res.status(400).json({
        success: false,
        error: "ID do pedido inválido"
      });
    }

    // Buscar pedido completo
    const pedido = await Pedido.findById(pedidoId)
      .populate("produtos.produto")
      .populate("usuario", "-senha");

    if (!pedido || pedido.usuario._id.toString() !== idUser) {
      return res.status(404).json({
        success: false,
        error: "Pedido não encontrado ou não pertence ao usuário"
      });
    }

    // Criar objeto de compra para IA
    const dadosCompra = {
      pedido: {
        _id: pedido._id,
        valorTotal: pedido.valorTotal,
        formaPagamento: pedido.formaPagamento,
        dataPedido: pedido.dataPedido
      },
      usuario: {
        _id: pedido.usuario._id,
        nome: pedido.usuario.nome,
        email: pedido.usuario.email,
        telefone: pedido.usuario.telefone
      },
      produtos: pedido.produtos.map(item => ({
        _id: item.produto._id,
        nome: item.produto.nome,
        descricao: item.produto.descricao,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
      })),
      metadata: {
        origem: "app-mobile",
        versao: "1.0"
      }
    };

    // Salvar no MongoDB
    const novaCompra = await Compra.create({
      pedidoId: pedido._id,
      usuario: idUser,
      dadosCompra
    });

    res.status(201).json({
      success: true,
      compra: novaCompra,
      message: "Dados da compra salvos para processamento por IA"
    });

  } catch (error) {
    console.error("Erro ao registrar compra para IA:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno ao registrar compra",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const obterComprasParaIA = async (req, res) => {
  try {
    // Buscar compras não processadas (para a IA)
    const compras = await Compra.find({
      processadoPorIA: false
    })
    .sort({ createdAt: 1 }) // Mais antigas primeiro
    .limit(10); // Limitar batch

    res.status(200).json({
      success: true,
      count: compras.length,
      data: compras
    });

  } catch (error) {
    console.error("Erro ao buscar compras para IA:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar compras para processamento"
    });
  }
};

const marcarComoProcessado = async (req, res) => {
  try {
    const { compraId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(compraId)) {
      return res.status(400).json({
        success: false,
        error: "ID da compra inválido"
      });
    }

    const compra = await Compra.findByIdAndUpdate(
      compraId,
      {
        processadoPorIA: true,
        statusIA: "concluido",
        $set: { "dadosCompra.processadoEm": new Date() }
      },
      { new: true }
    );

    if (!compra) {
      return res.status(404).json({
        success: false,
        error: "Compra não encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Compra marcada como processada",
      compra
    });

  } catch (error) {
    console.error("Erro ao atualizar status da compra:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar status"
    });
  }
};

module.exports = {
  registrarCompra,
  obterComprasParaIA,
  marcarComoProcessado
};