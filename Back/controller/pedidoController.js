//back/controller/pedidoController.js

const Pedido = require("../model/Pedido");
const Produto = require("../model/Produto");
const mongoose = require("mongoose");

// Função auxiliar para obter preço do produto
async function getPrecoProduto(produtoId) {
  try {
    const produto = await Produto.findById(produtoId);
    if (!produto) {
      console.warn(`Produto não encontrado: ${produtoId}`);
      return 0;
    }
    return produto.valor || 0;
  } catch (error) {
    console.error(`Erro ao buscar preço do produto ${produtoId}:`, error);
    return 0;
  }
}

// Adicionar novo pedido
const addPedido = async (req, res) => {
  try {
    const { produtos, formaPagamento, observacoes } = req.body;
    const idUser = req.user.id;

    // Validação dos dados de entrada
    if (!produtos || !Array.isArray(produtos)) {
      return res.status(400).json({ 
        success: false,
        error: "Lista de produtos inválida ou não fornecida" 
      });
    }

    if (!formaPagamento || !["Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito"].includes(formaPagamento)) {
      return res.status(400).json({
        success: false,
        error: "Forma de pagamento inválida"
      });
    }

    // Verificar se todos os produtos têm quantidade válida
    const produtosComQuantidade = produtos.map(item => ({
      produtoId: item.produto,
      quantidade: item.quantidade && item.quantidade > 0 ? item.quantidade : 1
    }));

    // Verificar IDs dos produtos
    const produtosValidos = produtosComQuantidade.filter(item => 
      mongoose.Types.ObjectId.isValid(item.produtoId)
    );

    if (produtosValidos.length !== produtos.length) {
      return res.status(400).json({
        success: false,
        error: "Contém IDs de produtos inválidos"
      });
    }

    // Converter para o formato do schema com quantidades
    const itensPedido = await Promise.all(
      produtosValidos.map(async (item) => {
        const preco = await getPrecoProduto(item.produtoId);
        return {
          produto: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: preco
        };
      })
    );

    // Calcular valor total baseado nas quantidades
    const valorTotal = itensPedido.reduce(
      (total, item) => total + (item.precoUnitario * item.quantidade),
      0
    );

    // Criar o pedido
    const novoPedido = new Pedido({
      usuario: idUser,
      produtos: itensPedido,
      formaPagamento,
      valorTotal,
      observacoes: observacoes || null,
      status: "pendente", // Status inicial como pendente
      dataPedido: new Date()
    });

    await novoPedido.save();

    // Popular os dados do produto para a resposta
    const pedidoCompleto = await Pedido.findById(novoPedido._id)
      .populate("produtos.produto")
      .populate("usuario", "-senha");

    res.status(201).json({
      success: true,
      pedido: pedidoCompleto,
      message: "Pedido criado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao criar pedido:", {
      error: error.message,
      body: req.body,
      user: req.user.id,
      time: new Date().toISOString()
    });
    
    res.status(500).json({ 
      success: false,
      error: "Erro interno ao processar pedido",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obter pedidos do usuário
const getPedidos = async (req, res) => {
  try {
    const idUser = req.user.id;
    const pedidos = await Pedido.find({ usuario: idUser })
      .populate("produtos.produto")
      .populate("usuario", "-senha")
      .sort({ dataPedido: -1 }); // Mais recentes primeiro

    return res.status(200).json({
      success: true,
      data: pedidos
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar pedidos"
    });
  }
};

// Deletar pedido
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID do pedido inválido"
      });
    }

    const pedido = await Pedido.findOneAndDelete({
      _id: id,
      usuario: req.user.id // Garante que só o dono pode deletar
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: "Pedido não encontrado ou não pertence ao usuário"
      });
    }

    res.status(200).json({
      success: true,
      message: "Pedido deletado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao deletar pedido"
    });
  }
};

// Atualizar pedido
const putPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { produtos, status, observacoes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID do pedido inválido"
      });
    }

    // Apenas atualiza o status se fornecido e válido
    const updateData = {};
    if (status && ["pendente", "preparando", "pronto", "entregue", "cancelado"].includes(status)) {
      updateData.status = status;
    }

    if (observacoes !== undefined) {
      updateData.observacoes = observacoes;
    }

    // Se produtos foram fornecidos
    if (produtos && Array.isArray(produtos)) {
      const produtosComQuantidade = produtos.map(item => ({
        produtoId: item.produto,
        quantidade: item.quantidade && item.quantidade > 0 ? item.quantidade : 1
      }));

      const produtosValidos = produtosComQuantidade.filter(item => 
        mongoose.Types.ObjectId.isValid(item.produtoId)
      );
      
      if (produtosValidos.length !== produtos.length) {
        return res.status(400).json({
          success: false,
          error: "Contém IDs de produtos inválidos"
        });
      }

      const itensPedido = await Promise.all(
        produtosValidos.map(async (item) => {
          const preco = await getPrecoProduto(item.produtoId);
          return {
            produto: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: preco
          };
        })
      );

      updateData.produtos = itensPedido;
      updateData.valorTotal = itensPedido.reduce(
        (total, item) => total + (item.precoUnitario * item.quantidade),
        0
      );
    }

    const pedidoAtualizado = await Pedido.findOneAndUpdate(
      {
        _id: id,
        usuario: req.user.id // Garante que só o dono pode atualizar
      },
      updateData,
      { new: true, runValidators: true }
    )
    .populate("produtos.produto")
    .populate("usuario", "-senha");

    if (!pedidoAtualizado) {
      return res.status(404).json({
        success: false,
        error: "Pedido não encontrado ou não pertence ao usuário"
      });
    }

    res.status(200).json({
      success: true,
      data: pedidoAtualizado,
      message: "Pedido atualizado com sucesso"
    });

  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao atualizar pedido"
    });
  }
};

module.exports = {
  getPedidos,
  addPedido,
  deletePedido,
  putPedido
};