// back/services/IaService.js

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const Pedido = require("../model/Pedido");
const User = require("../model/User");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const aiService = {
  processUserQuestion: async (userId, pergunta) => {
    try {
      // Buscar usuário para obter nome
      const user = await User.findById(userId);
      const userName = user?.nome || "Cliente";

      // Buscar pedidos do usuário com produtos populados
      const pedidos = await Pedido.find({ usuario: userId })
        .sort({ dataPedido: -1 })
        .limit(3)
        .populate('produtos.produto');

      // Montar contexto com quantidades corretas
      let context = `Informações do cliente: ${userName}\n\n`;

      if (pedidos.length > 0) {
        context += "Últimos pedidos:\n";
        pedidos.forEach((pedido, index) => {
          context += `Pedido #${pedido._id.toString().substring(0, 6)}:\n`;
          context += `- Data: ${pedido.dataPedido.toLocaleDateString()}\n`;
          context += `- Status: ${pedido.status}\n`;
          context += `- Valor Total: R$${pedido.valorTotal.toFixed(2)}\n`;
          context += `- Itens:\n`;
          
          pedido.produtos.forEach(produto => {
            context += `  • ${produto.produto.nome} (${produto.quantidade}x) - R$${(produto.precoUnitario * produto.quantidade).toFixed(2)}\n`;
          });
          
          context += `\n`;
        });
      } else {
        context += "Nenhum pedido encontrado no histórico.\n";
      }

      // Prompt mais específico
      const prompt = `
        Você é um assistente virtual especializado em atendimento ao cliente do Japastel.
        Responda apenas com base nas informações fornecidas abaixo.
        Seja direto, objetivo e mantenha um tom amigável.

        Dados do cliente:
        ${context}

        Pergunta: "${pergunta}"

        Regras importantes:
        1. Para valores, sempre formate como R$XX.XX
        2. Mostre as quantidades exatas de cada item comprado
        3. Para pedidos, mostre o valor total e detalhe cada item com sua quantidade
        4. Se não souber a resposta, diga: "Não encontrei essa informação em seus pedidos recentes."
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();

    } catch (error) {
      console.error("Erro no serviço de IA:", error);
      return "Desculpe, estou com dificuldades para responder agora. Por favor, tente novamente mais tarde.";
    }
  },
};

module.exports = aiService;