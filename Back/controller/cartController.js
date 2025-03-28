// controller/cartController.js
const CartItem = require('../model/CartItem');
const Produto = require('../model/Produto');
const Pedido = require('../model/Pedido');

// Adiciona item ao carrinho
exports.addToCart = async (req, res) => {
  try {
    const { idProduto, quantidade = 1 } = req.body;
    const usuarioId = req.user.id; // Agora pegando do token JWT

    const produto = await Produto.findById(idProduto);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    let item = await CartItem.findOne({ idProduto, usuarioId });

    if (item) {
      item.quantidade += Number(quantidade);
    } else {
      item = new CartItem({
        nome: produto.nome,
        preco: produto.valor,
        quantidade: Number(quantidade),
        idProduto: produto._id,
        usuarioId
      });
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item do carrinho
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id; // Verifica se o item pertence ao usuário

    const item = await CartItem.findOneAndDelete({ 
      _id: id, 
      usuarioId 
    });

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado ou não pertence ao usuário' });
    }

    res.status(200).json({ message: 'Item removido do carrinho' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualiza quantidade do item
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;
    const usuarioId = req.user.id;

    if (quantidade < 1) {
      return res.status(400).json({ error: 'Quantidade deve ser pelo menos 1' });
    }

    const updatedItem = await CartItem.findOneAndUpdate(
      { _id: id, usuarioId },
      { quantidade },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item não encontrado ou não pertence ao usuário' });
    }
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtém itens do carrinho
exports.getCartItems = async (req, res) => {
  try {
    const usuarioId = req.user.id; // Agora pegando do token JWT
    const items = await CartItem.find({ usuarioId });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Limpa o carrinho
exports.clearCart = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    await CartItem.deleteMany({ usuarioId });
    res.status(200).json({ message: 'Carrinho limpo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Finaliza o pedido (NOVO MÉTODO)
exports.finalizarPedido = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { formaPagamento, observacoes } = req.body;

    // 1. Obter itens do carrinho
    const cartItems = await CartItem.find({ usuarioId });
    
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // 2. Calcular valor total
    const valorTotal = cartItems.reduce(
      (total, item) => total + (item.preco * item.quantidade), 
      0
    );

    // 3. Criar array de produtos para o pedido
    const produtos = cartItems.map(item => ({
      produto: item.idProduto,
      quantidade: item.quantidade,
      precoUnitario: item.preco
    }));

    // 4. Criar o pedido
    const novoPedido = new Pedido({
      usuario: usuarioId,
      produtos,
      formaPagamento,
      valorTotal,
      observacoes,
      status: 'pendente'
    });

    await novoPedido.save();

    // 5. Limpar o carrinho
    await CartItem.deleteMany({ usuarioId });

    // 6. Retornar resposta
    res.status(201).json({
      success: true,
      pedido: novoPedido,
      message: 'Pedido finalizado com sucesso!'
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao finalizar pedido',
      details: error.message 
    });
  }
};