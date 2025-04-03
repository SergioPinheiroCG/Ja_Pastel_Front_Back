const API_URL = "http://192.168.0.7:5000";

const request = async (
  endpoint: string,
  method: string,
  body?: any,
  options?: { headers?: Record<string, string> }
) => {
  // Normaliza o endpoint para sempre começar com /api/
  const normalizedEndpoint = endpoint.startsWith('/api/') 
    ? endpoint 
    : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    console.log(`[${method}] Requisição para: ${API_URL}${normalizedEndpoint}`);
    if (body) console.log(`Corpo:`, JSON.stringify(body));

    const headers = {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    };

    const response = await fetch(`${API_URL}${normalizedEndpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const text = await response.text();
    console.log(`Resposta bruta:`, text);

    // Verifica se a resposta é HTML (erro 404)
    if (text.startsWith('<!DOCTYPE html>')) {
      throw new Error(`Endpoint não encontrado: ${normalizedEndpoint}`);
    }

    if (!text) {
      throw new Error("Resposta vazia do servidor");
    }

    const data = JSON.parse(text);
    console.log(`Resposta parseada:`, data);

    if (!response.ok) {
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        endpoint: normalizedEndpoint,
        response: data
      };
      console.error("Erro detalhado:", errorDetails);

      // Tratamento específico para erros de login/credenciais inválidas
      if (response.status === 401) {
        throw new Error("Email ou senha inválidos");
      }

      throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Erro completo:", {
      message: error.message,
      endpoint: normalizedEndpoint,
      method,
      time: new Date().toISOString()
    });

    // Mensagens mais amigáveis para o usuário
    let userMessage = "Erro de conexão com o servidor";

    if (error.message.includes('Endpoint não encontrado')) {
      userMessage = "Rota não encontrada no servidor";
    } else if (error.message.includes('JSON Parse error')) {
      userMessage = "Resposta inválida do servidor";
    } else if (error.message.includes("Email ou senha inválidos")) {
      userMessage = "Email ou senha inválidos";
    }

    throw new Error(userMessage);
  }
};

/**
 * Autenticação
 */
interface UserData {
  id: string;
  email: string;
  nome?: string; // Opcional se nem sempre vier
}

interface LoginResponse {
  token: string;
  user: UserData;
}

const login = async (email: string, senha: string): Promise<LoginResponse> => {
  return await request('/login', 'POST', { email, senha });
};

/**
 * Função para registrar o usuário
 */
const register = async (
  nome: string,
  email: string,
  telefone: string,
  cpf: string,
  senha: string
) => {
  return await request('/register', 'POST', { nome, email, telefone, cpf, senha });
};

export { request, login, register };
