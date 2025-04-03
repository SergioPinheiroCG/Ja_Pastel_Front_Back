const mongoose = require("mongoose");

const CompraSchema = new mongoose.Schema({
  pedidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pedido",
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dadosCompra: {
    type: mongoose.Schema.Types.Mixed, // Armazena o JSON completo
    required: true
  },
  dataCompra: {
    type: Date,
    default: Date.now
  },
  processadoPorIA: {
    type: Boolean,
    default: false
  },
  statusIA: {
    type: String,
    enum: ["pendente", "processando", "concluido", "erro"],
    default: "pendente"
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("Compra", CompraSchema);