// model/CartItem.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  idProduto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
