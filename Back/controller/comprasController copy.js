const Compras = require("../model/Compras");

// Função para criar uma nova compra


const criarCompra = async (req, res) => {
  try {
    console.log('Corpo da requisição:', req.body); // Log para debug
    
     // Validação básica
     if (!req.body.itens || req.body.itens.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'A compra deve conter pelo menos um item.'
      });
    }
    
    const dadosCompra = req.body;

    if (!dadosCompra) {
      return res.status(400).json({ message: "Dados da compra são obrigatórios." });
    }

    // Criar nova compra no MongoDB
    const novaCompra = new Compras({
      dados: dadosCompra, // Armazena todo o objeto JSON
      criadoEm: new Date()
    });

    await novaCompra.save();

    res.status(201).json({
      message: "Compra registrada com sucesso!",
      compra: novaCompra
    });

  } catch (error) {
    console.error("Erro ao salvar compra:", error);
    res.status(500).json({ 
      message: "Erro ao processar compra",
      error: error.message 
    });
  }
};


// Buscar todas as compras
const listarCompras = async (req, res) => {
  try {
    const compras = await Compras.find();
    const comprasFormatadas = compras.map(compra => ({
      id: compra._id,
      conteudo: JSON.parse(compra.conteudo),
      createdAt: compra.createdAt
    }));

    res.status(200).json(comprasFormatadas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as compras.", detalhes: error.message });
  }
};

// Buscar uma compra por ID
const buscarCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compras.findById(id);

    if (!compra) {
      return res.status(404).json({ error: "Compra não encontrada." });
    }

    res.status(200).json({ id: compra._id, conteudo: JSON.parse(compra.conteudo), createdAt: compra.createdAt });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a compra.", detalhes: error.message });
  }
};

// Atualizar uma compra por ID
const atualizarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { conteudo } = req.body;

    if (!conteudo) {
      return res.status(400).json({ error: "O campo 'conteudo' é obrigatório." });
    }

    const compraAtualizada = await Compras.findByIdAndUpdate(id, { conteudo: JSON.stringify(conteudo) }, { new: true });

    if (!compraAtualizada) {
      return res.status(404).json({ error: "Compra não encontrada." });
    }

    res.status(200).json({ message: "Compra atualizada com sucesso!", compra: compraAtualizada });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a compra.", detalhes: error.message });
  }
};

// Deletar uma compra por ID
const deletarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const compraDeletada = await Compras.findByIdAndDelete(id);

    if (!compraDeletada) {
      return res.status(404).json({ error: "Compra não encontrada." });
    }

    res.status(200).json({ message: "Compra deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar a compra.", detalhes: error.message });
  }
};

module.exports = {
  criarCompra,
  listarCompras,
  buscarCompraPorId,
  atualizarCompra,
  deletarCompra
};
