//front/src/app/%28tabs%29/cart.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import styles from "./styles/cart.styles";
import { request } from "../../services/api";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } =
    useCart();
  const router = useRouter();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("Dinheiro");
  const [userName, setUserName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [name, token] = await AsyncStorage.multiGet([
          "userName",
          "authToken",
        ]);

        if (name[1]) {
          setUserName(name[1]);
          return;
        }

        if (!token[1]) throw new Error("Token não encontrado");

        const response = await request("/api/me", "GET", null, {
          headers: { Authorization: `Bearer ${token[1]}` },
        });

        const userName = response.user?.nome || "Cliente";
        setUserName(userName);
        await AsyncStorage.setItem("userName", userName);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setUserName("Cliente");
      }
    };

    fetchUserData();
  }, []);

  const renderPaymentOption = (paymentMethod: string) => {
    const isSelected = selectedPaymentMethod === paymentMethod;
    const iconName = isSelected ? "check-square" : "square";
    let paymentIcon = null;

    switch (paymentMethod) {
      case "Dinheiro":
        paymentIcon = <FontAwesome name="money" size={24} color="green" />;
        break;
      case "Pix":
        paymentIcon = <FontAwesome name="qrcode" size={24} color="blue" />;
        break;
      case "Cartão de Crédito":
        paymentIcon = <FontAwesome name="credit-card" size={24} color="red" />;
        break;
      default:
        paymentIcon = null;
    }

    return (
      <View style={styles.paymentOption}>
        <TouchableOpacity
          style={styles.paymentOptionButton}
          onPress={() => setSelectedPaymentMethod(paymentMethod)}
        >
          <FontAwesome
            name={iconName}
            size={24}
            color={isSelected ? "green" : "gray"}
          />
          <Text style={styles.paymentText}>{paymentMethod}</Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>{paymentIcon}</View>
      </View>
    );
  };

  /*const salvarCompraEmArquivoUnico = async (pedidoData: any) => {
    try {
      // 1. Definir caminho do arquivo único
      const caminhoArquivo = `${FileSystem.documentDirectory}compras_geral.txt`;
      console.log("Caminho do arquivo:", FileSystem.documentDirectory);

      // 2. Criar linha da compra (formato JSON compacto)
      const linhaCompra = JSON.stringify({
        timestamp: new Date().toISOString(),
        pedidoId: pedidoData._id,
        usuarioId: pedidoData.usuario._id,
        nome: pedidoData.nomeUsuario,
        produtos: pedidoData.produtos.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          quantidade: p.quantidade,
        })),
        total: pedidoData.valorTotal,
        pagamento: pedidoData.formaPagamento,
      });

      // 3. Adicionar ao arquivo (com quebra de linha)
      await FileSystem.writeAsStringAsync(
        caminhoArquivo,
        linhaCompra + "\n", // \n para nova linha
        {
          encoding: FileSystem.EncodingType.UTF8,
          append: true, // Mantém o conteúdo existente
        }
      );
      console.log("Caminho do arquivo:", FileSystem.documentDirectory);
      console.log("Compra adicionada ao arquivo:", caminhoArquivo);
      return caminhoArquivo;
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
      throw error;
    }
  };*/

  /*const finalizarPedido = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione itens ao carrinho antes de finalizar."
      );
      return;
    }

    if (
      selectedPaymentMethod === "Cartão de Crédito" &&
      (!cardNumber || !securityCode || !expiryDate)
    ) {
      Alert.alert("Erro", "Preencha todos os campos do cartão.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Obter dados do usuário
      const [token, userId, userName] = await AsyncStorage.multiGet([
        "authToken",
        "userId",
        "userName",
      ]);

      if (!token[1] || !userId[1]) {
        throw new Error("Usuário não autenticado.");
      }

      // 2. Preparar dados do pedido
      const pedidoData = {
        produtos: cartItems.map((item) => item.id),
        formaPagamento: selectedPaymentMethod,
        valorTotal: getTotal(),
        usuario: userId[1],
        ...(selectedPaymentMethod === "Cartão de Crédito" && {
          cartao: {
            numero: cardNumber,
            codigoSeguranca: securityCode,
            dataValidade: expiryDate,
          },
        }),
      };

      // 3. Enviar para a API
      const response = await request("/api/pedidos", "POST", pedidoData, {
        headers: { Authorization: `Bearer ${token[1]}` },
      });

      if (!response.success) {
        throw new Error(response.message || "Erro ao processar pedido");
      }

      // 4. Salvar no arquivo único
      const compraData = {
        _id: response.pedido._id,
        usuario: {
          _id: userId[1],
          cpf: response.pedido.usuario?.cpf,
          telefone: response.pedido.usuario?.telefone,
        },
        nomeUsuario: userName[1] || "Cliente",
        formaPagamento: selectedPaymentMethod,
        valorTotal: getTotal(),
        produtos: cartItems.map((item) => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco,
        })),
      };

      await salvarCompraEmArquivoUnico(compraData);

      // 5. Feedback para o usuário
      Alert.alert(
        "Sucesso!",
        `Pedido #${response.pedido._id} realizado com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/pedido");
            },
          },
        ]
      );

      // Limpar dados do cartão se necessário
      if (selectedPaymentMethod === "Cartão de Crédito") {
        setCardNumber("");
        setSecurityCode("");
        setExpiryDate("");
      }
    } catch (error) {
      console.error("Erro no pedido:", {
        error,
        time: new Date().toISOString(),
      });
      Alert.alert(
        "Erro",
        "Erro ao finalizar pedido. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizarPedido = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens ao carrinho antes de finalizar.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // 1. Criar objeto JSON com os dados da compra
      const compraJSON = {
        data: new Date().toISOString(),
        usuario: {
          nome: userName,
          // Adicione outros dados do usuário se necessário
        },
        itens: cartItems.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          subtotal: item.quantidade * item.preco
        })),
        pagamento: {
          metodo: selectedPaymentMethod,
          ...(selectedPaymentMethod === "Cartão de Crédito" && {
            cartao: {
              ultimosDigitos: cardNumber.slice(-4), // Armazena apenas os últimos 4 dígitos
              tipo: cardNumber.startsWith('4') ? 'Visa' : 
                    cardNumber.startsWith('5') ? 'Mastercard' : 'Outro'
            }
          })
        },
        total: getTotal(),
        status: "pendente"
      };
  
      // 2. Enviar para o back-end
      const response = await fetch('http://192.168.0.7:5000/compras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compraJSON)
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar compra');
      }
  
      // 3. Opcional: Salvar localmente como backup
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}compra_${Date.now()}.json`,
        JSON.stringify(compraJSON, null, 2)
      );
  
      Alert.alert("Sucesso!", "Compra registrada com sucesso!");
      clearCart();
      
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Não foi possível finalizar a compra");
    } finally {
      setIsSubmitting(false);
    }
  };*/

  const finalizarPedido = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens ao carrinho antes de finalizar.");
      return;
    }
  
    if (selectedPaymentMethod === "Cartão de Crédito" && 
        (!cardNumber || !securityCode || !expiryDate)) {
      Alert.alert("Erro", "Preencha todos os campos do cartão.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const [token, userId, userName] = await AsyncStorage.multiGet([
        "authToken", "userId", "userName"
      ]);
  
      if (!token[1] || !userId[1]) {
        throw new Error("Usuário não autenticado.");
      }
  
      // 1. Primeiro enviar para pedidos (formato original)
      const pedidoData = {
        produtos: cartItems.map((item) => item.id),
        formaPagamento: selectedPaymentMethod,
        valorTotal: getTotal(),
        usuario: userId[1],
        ...(selectedPaymentMethod === "Cartão de Crédito" && {
          cartao: {
            numero: cardNumber,
            codigoSeguranca: securityCode,
            dataValidade: expiryDate,
          },
        }),
      };
  
      const responsePedidos = await request("/api/pedidos", "POST", pedidoData, {
        headers: { Authorization: `Bearer ${token[1]}` },
      });
  
      if (!responsePedidos.success) {
        throw new Error(responsePedidos.message || "Erro ao processar pedido");
      }
  
      // 2. Preparar dados para compras (formato JSON completo)
      const compraData = {
        data: new Date().toISOString(),
        pedidoId: responsePedidos.pedido._id,
        usuario: {
          id: userId[1],
          nome: userName[1] || "Cliente",
        },
        itens: cartItems.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
          subtotal: item.quantidade * item.preco
        })),
        pagamento: {
          metodo: selectedPaymentMethod,
          ...(selectedPaymentMethod === "Cartão de Crédito" && {
            cartao: {
              ultimosDigitos: cardNumber.slice(-4),
              tipo: cardNumber.startsWith('4') ? 'Visa' : 
                    cardNumber.startsWith('5') ? 'Mastercard' : 'Outro'
            }
          })
        },
        total: getTotal(),
        status: "entregue"
      };
  
      // 3. Enviar para compras (sem stringificar novamente)
      const responseCompras = await request("/api/compras", "POST", compraData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token[1]}`
        }
      });
  
      if (!responseCompras.success) {
        console.warn("Aviso: Compra não foi registrada na coleção Compras:", 
          responseCompras.message);
      }
  /*
      // 4. Salvar backup local
      await salvarCompraEmArquivoUnico({
        _id: responsePedidos.pedido._id,
        ...compraData
      });*/
  
      Alert.alert(
        "Sucesso!", 
        `Pedido #${responsePedidos.pedido._id} registrado com sucesso!`,
        [{
          text: "OK",
          onPress: () => {
            clearCart();
            router.push("/pedido");
          }
        }]
      );
  
      if (selectedPaymentMethod === "Cartão de Crédito") {
        setCardNumber("");
        setSecurityCode("");
        setExpiryDate("");
      }
  
    } catch (error: any) { // Adicione tipagem 'any' temporariamente para debug
      console.error("Erro completo:", {
        message: error.message,
        response: error.response?.data, // Adicione esta linha
        stack: error.stack,
        time: new Date().toISOString(),
      });
    
      let errorMessage = "Erro ao finalizar pedido. Tente novamente.";
      
      if (error.response) {
        // Se a API retornou um erro estruturado
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Se a requisição foi feita mas não houve resposta
        errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
      }
    
      Alert.alert("Erro", errorMessage);
    }
  };


  const handleRemoveItem = (id: string) => {
    Alert.alert("Remover item", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        onPress: () => removeFromCart(id),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Seu Carrinho, </Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemText}>{item.nome}</Text>
                <Text style={styles.itemPrice}>
                  R$ {(item.quantidade * item.preco).toFixed(2)}
                </Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <FontAwesome
                    name="minus-circle"
                    size={24}
                    color={item.quantidade > 1 ? "red" : "gray"}
                  />
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantidade}</Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantidade + 1)}
                >
                  <FontAwesome name="plus-circle" size={24} color="green" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                  <FontAwesome
                    name="trash"
                    size={24}
                    color="gray"
                    style={styles.trashIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.footerContainer}>
              <Text style={styles.totalText}>
                Total: R$ {getTotal().toFixed(2)}
              </Text>

              <View style={styles.paymentMethodContainer}>
                <Text style={styles.paymentMethodTitle}>
                  Forma de pagamento
                </Text>
                <View style={styles.paymentMethodOptions}>
                  {["Dinheiro", "Pix", "Cartão de Crédito"].map(
                    (paymentMethod) => (
                      <View
                        key={paymentMethod}
                        style={styles.paymentOptionContainer}
                      >
                        {renderPaymentOption(paymentMethod)}
                      </View>
                    )
                  )}
                </View>
              </View>

              {selectedPaymentMethod === "Cartão de Crédito" && (
                <View style={styles.cardInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Número do Cartão"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    maxLength={16}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Código de Segurança"
                    value={securityCode}
                    onChangeText={setSecurityCode}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Data de Validade (MM/AA)"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              )}

              <View style={styles.finalizarButton}>
                <Button
                  title={isSubmitting ? "Processando..." : "Finalizar Pedido"}
                  color="green"
                  onPress={finalizarPedido}
                  disabled={isSubmitting}
                />
              </View>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default Cart;
