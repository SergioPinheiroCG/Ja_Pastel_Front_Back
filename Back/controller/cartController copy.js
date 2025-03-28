// controller/cartController.js
const CartItem = require('../model/CartItem');
const Produto = require('../model/Produto');

exports.addToCart = async (req, res) => {
  try {
    const { idProduto, quantidade = 1 } = req.body;
    const usuarioId = req.user.id;

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

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await CartItem.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removido do carrinho' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (quantidade < 1) {
      return res.status(400).json({ error: 'Quantidade deve ser pelo menos 1' });
    }

    const updatedItem = await CartItem.findByIdAndUpdate(
      id,
      { quantidade },
      { new: true }
    );
    
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const items = await CartItem.find({ usuarioId });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    await CartItem.deleteMany({ usuarioId });
    res.status(200).json({ message: 'Carrinho limpo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};