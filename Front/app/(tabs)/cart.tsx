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
import styles from "./styles/cart.styles";
import { request } from "../../services/api";
import chat from "../chat";

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
        const token = await AsyncStorage.getItem("authToken");
        const userId = await AsyncStorage.getItem("userId");

        console.log("🚀 Token:", token);
        console.log("🚀 UserID:", userId);

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await request("/api/me", "GET", null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🚀 Resposta completa:", response);

        if (!response?.user) {
          throw new Error("Dados do usuário não encontrados");
        }

        setUserName(response.user.nome ||  "Cliente");
        console.log("🚀 Nome do usuário:", response.user.nome);
      } catch (error) {
        console.error("Erro detalhado:", {
          message: error.message,
          stack: error.stack,
          response: error.response,
        });
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário");
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

  const finalizarPedido = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Carrinho vazio",
        "Adicione itens ao carrinho antes de finalizar o pedido."
      );
      return;
    }

    if (selectedPaymentMethod === "Cartão de Crédito") {
      if (!cardNumber || !securityCode || !expiryDate) {
        Alert.alert(
          "Erro",
          "Por favor, preencha todos os campos do cartão de crédito."
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Obter credenciais do usuário
      const [token, userId] = await Promise.all([
        AsyncStorage.getItem("authToken"),
        AsyncStorage.getItem("userId"),
      ]);

      console.log("Token:", token?.substring(0, 10) + "..."); // Log parcial do token por segurança
      console.log("UserID:", userId);

      if (!token || !userId) {
        throw new Error("Usuário não autenticado. Faça login novamente.");
      }

      // 2. Preparar dados do pedido
      const pedidoData = {
        produtos: cartItems.map((item) => item.id), // Apenas os IDs dos produtos
        formaPagamento: selectedPaymentMethod,
        valorTotal: getTotal(),
        usuario: userId,
        ...(selectedPaymentMethod === "Cartão de Crédito" && {
          cartao: {
            numero: cardNumber,
            codigoSeguranca: securityCode,
            dataValidade: expiryDate,
          },
        }),
      };

      console.log("Dados do pedido:", JSON.stringify(pedidoData, null, 2));

      // 3. Enviar pedido para o backend
      const response = await request("/api/pedidos", "POST", pedidoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response || response.error) {
        throw new Error(response?.error || "Erro ao processar pedido");
      }

      // 4. Processar resposta
      const numeroPedido =
        response._id || Math.floor(1000 + Math.random() * 9000);

      Alert.alert(
        "Pedido Finalizado!",
        `Seu pedido foi confirmado com o número: #${numeroPedido}`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/pedido"); // Navegar para a tela de pedidos
            },
          },
        ]
      );

      // 5. Limpar dados sensíveis do cartão
      if (selectedPaymentMethod === "Cartão de Crédito") {
        setCardNumber("");
        setSecurityCode("");
        setExpiryDate("");
      }
    } catch (error) {
      console.error("Erro detalhado:", {
        message: error.message,
        stack: error.stack,
        credentials: {
          token: await AsyncStorage.getItem("authToken"),
          userId: await AsyncStorage.getItem("userId"),
        },
      });

      Alert.alert(
        "Erro",
        error.message ||
          "Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert("Remover item", "Tem certeza que deseja remover este item?", [
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

      <View style={styles.contentContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
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
              <>
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
              </>
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {cartItems.length > 0 && (
        <View style={styles.finalizarButton}>
          <Button
            title={isSubmitting ? "Processando..." : "Finalizar Pedido"}
            color="green"
            onPress={finalizarPedido}
            disabled={isSubmitting}
          />
        </View>
      )}
    </View>
  );
};

export default Cart;
