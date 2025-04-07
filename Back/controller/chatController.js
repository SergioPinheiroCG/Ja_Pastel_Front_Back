//back/controller/chatController.js

const aiService = require("../services/IaService");

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Mensagem inválida" 
      });
    }

    // Verifica se a pergunta não está vazia após remover espaços
    if (message.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "A mensagem deve conter pelo menos 3 caracteres"
      });
    }

    const response = await aiService.processUserQuestion(userId, message.trim());
    
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