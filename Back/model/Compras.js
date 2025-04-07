//back/model/Compras.js

const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  dados: { 
    type: Object, 
    required: true,
    validate: {
      validator: function(v) {
        return v && typeof v === 'object';
      },
      message: 'Dados da compra devem ser um objeto válido'
    }
  },
  criadoEm: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Compras', CompraSchema);