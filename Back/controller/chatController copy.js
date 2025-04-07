const aiService = require("../services/IaService");
const Compras = require("../model/Compras"); // Certifique-se de ter este modelo

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Validação da mensagem
    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return res.status(400).json({ 
        success: false,
        error: "A mensagem deve conter pelo menos 3 caracteres" 
      });
    }

    const trimmedMsg = message.trim().toLowerCase();

    // Verifica se é sobre compras/pedidos
    if (trimmedMsg.includes('compras') || trimmedMsg.includes('pedidos')) {
      const compras = await Compras.find({ 'dados.usuario.id': userId })
        .sort({ 'dados.data': -1 })
        .limit(3);

      if (comras.length > 0) {
        let resposta = 'Seus últimos pedidos:\n\n';
        compras.forEach((compra, index) => {
          resposta += `Pedido ${index + 1} (${compra.dados.status}):\n`;
          resposta += `Data: ${new Date(compra.dados.data).toLocaleString()}\n`;
          compra.dados.itens.forEach(item => {
            resposta += `- ${item.nome} (${item.quantidade}x): R$ ${item.subtotal}\n`;
          });
          resposta += `Total: R$ ${compra.dados.total}\n\n`;
        });
        return res.json({ success: true, response: resposta });
      } else {
        return res.json({ success: true, response: "Você não possui pedidos recentes." });
      }
    }

    // Se não for sobre compras, usa a IA
    const response = await aiService.processUserQuestion(userId, trimmedMsg);
    
    res.json({
      success: true,
      response: response || "Não consegui entender sua pergunta. Poderia reformular?",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Erro no chat:", error);
    res.status(500).json({ 
      success: false,
      error: "Erro ao processar mensagem",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};