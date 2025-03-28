// model/Pedido.js
const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  produtos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  }],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  formaPagamento: {
    type: String,
    enum: ['Dinheiro', 'Pix', 'Cartão de Crédito'],
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'preparando', 'entregue', 'cancelado'],
    default: 'pendente'
  },
  data: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', PedidoSchema);