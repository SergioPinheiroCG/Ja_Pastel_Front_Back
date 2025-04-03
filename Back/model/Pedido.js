const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  produtos: [
    {
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: true,
      },
      quantidade: {
        type: Number,
        required: true,
      },
      precoUnitario: {
        type: Number,
        required: true,
      },
    },
  ],
  formaPagamento: {
    type: String,
    required: true,
    enum: ["Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito"],
  },
  valorTotal: {
    type: Number,
    required: true,
  },
  observacoes: String,
  status: {
    type: String,
    default: "pronto",
    enum: ["pendente", "preparando", "pronto", "entregue", "cancelado"],
  },
  dataPedido: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pedido", PedidoSchema);
