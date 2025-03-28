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

const addPedido = async (req, res) => {
  try {
    const { produtos, formaPagamento, valorTotal } = req.body;
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

    if (!valorTotal || isNaN(valorTotal) || valorTotal <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valor total inválido"
      });
    }

    // Verificar IDs dos produtos
    const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (produtosValidos.length !== produtos.length) {
      return res.status(400).json({
        success: false,
        error: "Contém IDs de produtos inválidos"
      });
    }

    // Converter array de IDs para o formato do schema
    const itensPedido = await Promise.all(
      produtosValidos.map(async (produtoId) => {
        const preco = await getPrecoProduto(produtoId);
        return {
          produto: produtoId,
          quantidade: 1, // Você pode ajustar isso conforme sua lógica
          precoUnitario: preco
        };
      })
    );

    // Calcular valor total real para verificação
    const totalCalculado = itensPedido.reduce(
      (total, item) => total + (item.precoUnitario * item.quantidade),
      0
    );

    // Verificar discrepância maior que 10%
    if (Math.abs(totalCalculado - valorTotal) / totalCalculado > 0.1) {
      console.warn(`Diferença significativa no valor total. Enviado: ${valorTotal}, Calculado: ${totalCalculado}`);
    }

    // Criar o pedido
    const novoPedido = await Pedido.create({
      usuario: idUser,
      produtos: itensPedido,
      formaPagamento,
      valorTotal: totalCalculado, // Usar o valor calculado ou o valorTotal, conforme sua regra de negócio
      status: "pendente",
      dataPedido: new Date()
    });

    // Popular os dados do produto para a resposta
    const pedidoCompleto = await Pedido.findById(novoPedido._id)
      .populate("produtos.produto")
      .populate("usuario", "-senha"); // Exclui a senha do usuário

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

// Outras funções do controller (mantidas do seu código original)
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

const putPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { produtos, status } = req.body;

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

    // Se produtos foram fornecidos
    if (produtos && Array.isArray(produtos)) {
      const produtosValidos = produtos.filter(id => mongoose.Types.ObjectId.isValid(id));
      
      if (produtosValidos.length !== produtos.length) {
        return res.status(400).json({
          success: false,
          error: "Contém IDs de produtos inválidos"
        });
      }

      const itensPedido = await Promise.all(
        produtosValidos.map(async (produtoId) => {
          const preco = await getPrecoProduto(produtoId);
          return {
            produto: produtoId,
            quantidade: 1,
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